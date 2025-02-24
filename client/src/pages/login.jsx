import React, { useState } from "react";
import { login } from "../services/authService"; // Importation de la fonction login
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3 className="login-title">Connexion</h3>
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mot de passe"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Se connecter</button>
        </form>

        <p className="login-footer">
          Pas encore de compte ? <a href="/register">Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
