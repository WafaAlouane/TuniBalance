<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token); // Get token from Redux store

  const handleChangePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Mot de passe changé avec succès !");
      setError("");
      setOldPassword("");
      setNewPassword("");

      setTimeout(() => navigate("/BusinessOwner"), 2000); // Redirect after success
    } catch (error) {
      setError("Erreur lors du changement de mot de passe !");
      setSuccess("");
=======
import React, { useState } from 'react';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const resetToken = new URLSearchParams(window.location.search).get('token');
    console.log("handlePasswordChange is triggered!");

    if (!resetToken) {
      setError('Invalid reset link');
      return;
    } else {
      console.log("Your reset token is: ", resetToken);
    }

    console.log("Sending request with:", { resetToken, newPassword });

    try {
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);  // success message from backend
        setError('');
      } else {
        setError(data.message);  // error message from backend
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setMessage('');
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-75 shadow-lg rounded p-4 bg-white">
        {/* Colonne gauche : Texte d'information */}
        <div className="col-md-7 d-flex flex-column justify-content-center p-4 text-white bg-primary rounded-start">
          <h2 className="mb-3">Modification du mot de passe</h2>
          <p>Changez votre mot de passe pour sécuriser votre compte.</p>
        </div>

        {/* Colonne droite : Formulaire */}
        <div className="col-md-5 p-4">
          <h2 className="text-center text-primary mb-4">Changer le mot de passe</h2>

          {error && <div className="alert alert-danger">{error}</div>}
<<<<<<< HEAD
          {success && <div className="alert alert-success">{success}</div>}

          <form>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <FiLock className="me-2" />
                Ancien mot de passe
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Entrez votre ancien mot de passe"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <FiLock className="me-2" />
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Entrez votre nouveau mot de passe"
=======
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handlePasswordChange}>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

<<<<<<< HEAD
            <button
              type="button"
              className="btn btn-primary w-100 py-2"
              onClick={handleChangePassword}
            >
              Changer le mot de passe
            </button>
=======
            <button type="submit" className="btn btn-primary mt-3">Change Password</button>
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
          </form>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
};

export default ChangePassword;
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
