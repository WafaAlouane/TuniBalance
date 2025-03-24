// Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { verify2FA } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async () => {
    // Vérification de l'admin avant l'appel à l'API
    if (email === "admin@example.com" && password === "AdminPassword123!") {
      const adminUser = {
        email,
        role: "admin"
      };
     // Dans la vérification de l'admin :
localStorage.setItem("accessToken", "fake_admin_token"); // Clé corrigée
dispatch(loginSuccess({ user: adminUser, token: "fake_admin_token" }));
      navigate("/AdminDashboard");
      return;
    }

    try {
      // Authentification normale via l'API backend
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.accessToken
      }));
      //Enregistrer le token JWT dans le localStorage
      localStorage.setItem("accessToken", response.data.accessToken); 
    console.log("Token enregistré :", localStorage.getItem("accessToken"));


      const setupResponse = await axios.post(
        "http://localhost:3001/auth/2fa-setup",  // Vérifiez que l'URL correspond à la route dans votre backend
        {},  // Corps de la requête (vide ici, si votre API n'attend pas de données autres que le token)
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`, // Passez l'accessToken dans les en-têtes pour l'authentification
          },
        }
      );

      const { qrCodeImage } = setupResponse.data;
      setQrCodeImage(qrCodeImage);
      setShowTwoFactorInput(true);
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log("Token enregistré :", localStorage.getItem("accessToken"));
  

      
    } catch (error) {
      setError("Identifiants incorrects !");
    }
  };
const handleVerifyTwoFactorAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Token d'authentification manquant !");
        return;
      }

      const response = await verify2FA(token, twoFactorToken);
      
      if (response?.data?.user) {
        const { user } = response.data;
        const role = user.role?.toLowerCase();
        dispatch(loginSuccess({
          user: response.data.user,
          token: token 
        }));
        let redirectPath = '/';
      switch(role) {
        case 'business_owner':
          redirectPath = "/BusinessOwner";
          break;
        case 'admin':
          redirectPath = "/AdminDashboard";
          break;
        case 'accountant':
          redirectPath = "/comptable";
          break;
        case 'financier':
          redirectPath = "/financier";
          break;
        default:
          setError("Rôle utilisateur non reconnu !");
          return;
      }
      
      navigate(redirectPath);
        } else {
          setError("Échec de la vérification du code 2FA !");
        }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erreur lors de la vérification du code 2FA !";
      setError(errorMessage);
      console.error('Erreur 2FA:', error);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-75 shadow-lg rounded p-4 bg-white">
        {/* Colonne gauche : Texte d'information avec fond vert */}
        <div className="col-md-7 d-flex flex-column justify-content-center p-4 text-white bg-primary rounded-start">
          <h2 className="mb-3">Bienvenue de retour !</h2>
          <p>
            Connectez-vous pour accéder à votre tableau de bord et gérer vos finances efficacement.
          </p>
        </div>

        {/* Colonne droite : Formulaire de connexion */}
        <div className="col-md-5 p-4">
          <h2 className="text-center text-primary mb-4">Connexion</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form>
             {/* Si l'utilisateur est en train de saisir le code 2FA, on cache les champs d'email et mot de passe */}
             {!showTwoFactorInput ? (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FiMail className="me-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FiLock className="me-2" />
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100 py-2"
                  onClick={handleLogin}
                >
                  Se connecter
                </button>
              </>
            ) : (
              <div className="mt-3">
                <label className="form-label fw-bold">
                  Code de vérification 2FA
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Entrez le code 2FA"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-primary w-100 py-2 mt-2"
                  onClick={handleVerifyTwoFactorAuth}
                >
                  Vérifier le code 2FA
                </button>
                {qrCodeImage && (
                  <div className="mt-3 text-center">
                    <img src={qrCodeImage} alt="QR Code 2FA" />
                  </div>
                )}
              </div>
            )}
            
            <p className="mt-3 text-center">
              Pas encore de compte ? <a href="/register">Créer un compte</a>
            </p>
            <p className="mt-3 text-center">
              <a href="/forget-password" className="ms-2">Mot de passe oublié ?</a>
            </p>

           </form>
          
        </div>
      </div>
    </div>
  );
}