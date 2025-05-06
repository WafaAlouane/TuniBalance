import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiUser, FiDollarSign, FiBarChart2, FiPieChart, FiCreditCard, FiShield } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { verify2FA } from "../services/authService";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(""); // Store reCAPTCHA token
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value); // Set the reCAPTCHA token when the user completes the challenge
  };

  const handleLogin = async () => {
    // Vérification de l'admin avant l'appel à l'API
    if (email === "admin@example.com" && password === "AdminPassword123!") {
      const adminUser = {
        email,
        role: "admin"
      };
      localStorage.setItem("accessToken", "fake_admin_token"); // Clé corrigée
      dispatch(loginSuccess({ user: adminUser, token: "fake_admin_token" }));
      navigate("/AdminDashboard");
      return;
    }

    if (!recaptchaToken) {
      setError("Veuillez compléter le reCAPTCHA !");
      return;
    }

    try {
      // Authentification normale via l'API backend
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
        recaptchaToken,  // Send reCAPTCHA token to backend for verification
      });

      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.accessToken
      }));
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log("Token enregistré :", localStorage.getItem("accessToken"));

      const setupResponse = await axios.post(
        "http://localhost:3001/auth/2fa-setup",  // Vérifiez que l'URL correspond à la route dans votre backend
        {},
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
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
    <div className="min-h-screen d-flex align-items-center justify-content-center"
         style={{
           backgroundColor: '#121212',
           backgroundImage: 'url("https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1951&q=80")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundBlendMode: 'overlay',
           padding: '2rem'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg overflow-hidden"
                 style={{
                   backgroundColor: 'rgba(33, 37, 41, 0.85)',
                   backdropFilter: 'blur(10px)',
                   border: '1px solid rgba(66, 70, 73, 0.5)'
                 }}>
              <div className="row g-0">
                {/* Left Column - Information */}
                <div className="col-lg-6 d-none d-lg-block"
                     style={{
                       background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}>
                  {/* Abstract financial graphics */}
                  <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: '0.1' }}>
                    <FiBarChart2 style={{ color: '#93c5fd', fontSize: '200px' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', opacity: '0.1' }}>
                    <FiPieChart style={{ color: '#c7d2fe', fontSize: '150px' }} />
                  </div>

                  <div className="p-5 d-flex flex-column h-100 position-relative" style={{ zIndex: 1 }}>
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <FiDollarSign className="text-white me-2" style={{ fontSize: '2rem' }} />
                        <h1 className="h3 text-white fw-bold mb-0">TuniBalance</h1>
                      </div>

                      <h2 className="h2 text-white fw-bold mb-3">Financial Management Portal</h2>
                      <p className="text-white-50 mb-4">
                        Sign in to access your dashboard and manage your finances efficiently.
                      </p>

                      <div className="row g-3 mb-5">
                        <div className="col-6">
                          <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <FiBarChart2 className="text-info mb-2" />
                            <h5 className="text-white fw-bold mb-1">Financial Analytics</h5>
                            <p className="text-white-50 small mb-0">Track your performance</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <FiCreditCard className="text-info mb-2" />
                            <h5 className="text-white fw-bold mb-1">Budget Management</h5>
                            <p className="text-white-50 small mb-0">Optimize your resources</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex">
                        <div className="bg-info rounded-pill me-2" style={{ height: '4px', width: '30px' }}></div>
                        <div className="bg-info rounded-pill me-2 opacity-50" style={{ height: '4px', width: '30px' }}></div>
                        <div className="bg-info rounded-pill opacity-25" style={{ height: '4px', width: '30px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center mb-4">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                           style={{
                             width: '70px',
                             height: '70px',
                             background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'
                           }}>
                        <FiUser className="text-white" style={{ fontSize: '1.75rem' }} />
                      </div>
                      <h2 className="h3 text-white fw-bold">Sign In</h2>
                    </div>

                    {error && (
                      <div className="alert" style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', color: '#f8aeb5', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                        {error}
                      </div>
                    )}

                    <form>
                      {!showTwoFactorInput ? (
                        <>
                          <div className="mb-4">
                            <label className="form-label text-white-50 fw-medium">
                              <FiMail className="me-2" />
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control form-control-lg border-0"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                padding: '0.75rem 1rem'
                              }}
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <label className="form-label text-white-50 fw-medium">
                              <FiLock className="me-2" />
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control form-control-lg border-0"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                padding: '0.75rem 1rem'
                              }}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-4 d-flex justify-content-center">
                            <ReCAPTCHA
                              sitekey="6LcoRwErAAAAAIauP2SPQe1fvh5je4o4RwuvDy0V"
                              onChange={handleRecaptchaChange}
                              theme="dark"
                            />
                          </div>

                          <button
                            type="button"
                            className="btn btn-lg w-100 mb-4"
                            style={{
                              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={handleLogin}
                          >
                            Sign In
                          </button>
                        </>
                      ) : (
                        <div className="mt-3">
                          <div className="p-3 mb-4 rounded" style={{ backgroundColor: 'rgba(13, 110, 253, 0.2)', border: '1px solid rgba(13, 110, 253, 0.3)' }}>
                            <p className="text-info mb-0 small">
                              Please enter the verification code from your authentication app to complete the login.
                            </p>
                          </div>

                          <label className="form-label text-white-50 fw-medium">
                            2FA Verification Code
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg border-0"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              padding: '0.75rem 1rem'
                            }}
                            placeholder="Enter 2FA code"
                            value={twoFactorToken}
                            onChange={(e) => setTwoFactorToken(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-lg w-100 mt-3"
                            style={{
                              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={handleVerifyTwoFactorAuth}
                          >
                            Verify 2FA Code
                          </button>
                          {qrCodeImage && (
                            <div className="mt-4 text-center p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                              <p className="text-white-50 small mb-2">Scan this QR code with your authentication app</p>
                              <img src={qrCodeImage} alt="QR Code 2FA" className="img-fluid" style={{ maxWidth: '200px', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-4 mt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <p className="text-center text-white-50 mb-2">
                          Don't have an account? <a href="/register" className="text-info text-decoration-none">Create account</a>
                        </p>
                        <p className="text-center text-white-50">
                          <a href="/forget-password" className="text-info text-decoration-none">Forgot password?</a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
