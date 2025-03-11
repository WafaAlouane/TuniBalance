// Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    // Vérification de l'admin avant l'appel à l'API
    if (email === "admin@example.com" && password === "AdminPassword123!") {
      navigate("/Dashboard"); 
      return; // Redirection de l'admin sans appeler l'API backend
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
      // Enregistrer le token JWT dans le localStorage
      //localStorage.setItem("accessToken", response.data.accessToken);

      // Vérifiez le rôle de l'utilisateur et redirigez vers le tableau de bord correspondant
      const role = response.data.user.role.toLowerCase();
      if (role === "business_owner") {
        navigate("/BusinessOwner");
      } else if (role === "admin") {
        navigate("/Dashboard");
      }
    } catch (error) {
      setError("Identifiants incorrects !");
    }
  };


  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-75 shadow-lg rounded p-4 bg-white">
        {/* Colonne gauche : Texte d'information avec fond vert */}
        <div className="col-md-7 d-flex flex-column justify-content-center p-4 text-white bg-success rounded-start">
          <h2 className="mb-3">Bienvenue de retour !</h2>
          <p>
            Connectez-vous pour accéder à votre tableau de bord et gérer vos finances efficacement.
          </p>
        </div>

        {/* Colonne droite : Formulaire de connexion */}
        <div className="col-md-5 p-4">
          <h2 className="text-center text-success mb-4">Connexion</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form>
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
              className="btn btn-success w-100 py-2"
              onClick={handleLogin}
            >
              Se connecter
            </button>

            <p className="mt-3 text-center">
              Pas encore de compte ? <a href="/register">Créer un compte</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
