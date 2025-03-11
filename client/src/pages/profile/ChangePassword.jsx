import React, { useState } from 'react';

const ChangePassword = () => {

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const resetToken = new URLSearchParams(window.location.search).get('token');
    console.log("This is a log message");

    if (!resetToken) {
      setError('Invalid reset link');
      return;
    }
    else {
        console.log("your reset token is "+resetToken);
    }

    try {
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);  // success message from backend
      } else {
        setError(data.message);  // error message from backend
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Your Password</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

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

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
