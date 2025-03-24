import React, { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send password reset link");
      }

      setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-75 shadow-lg rounded p-4 bg-white">
        <div className="col-md-7 d-flex flex-column justify-content-center p-4 text-white bg-primary rounded-start">
          <h2 className="mb-3">Modification du mot de passe</h2>
          <p>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>
        </div>

        <div className="col-md-5 p-4">
          <h2 className="text-center text-primary mb-4">Mot de passe oublié</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handlePasswordReset}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Entrez votre Email :
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;