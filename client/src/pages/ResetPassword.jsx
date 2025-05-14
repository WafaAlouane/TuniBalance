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
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handlePasswordChange}>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;