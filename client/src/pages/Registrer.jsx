import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css"; // Importer Bootstrap si ce n'est pas encore fait
import { register } from "../services/authService";
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phoneNumber.startsWith('+216')) {
      formData.phoneNumber = '+216' + formData.phoneNumber;
    }
    if (!/^\+216[0-9]{8}$/.test(formData.phoneNumber)) {
      setError('Numéro de téléphone invalide (doit commencer par +216 et avoir 8 chiffres)');
      return;
    }

    try {
      const { user } = await register(formData);
      localStorage.setItem('tempUser', JSON.stringify(user));
      navigate('/login');

    } catch (err) {
      setError(err.message.includes('409') 
        ? 'Cet email est déjà utilisé' 
        : err.message
      );
    }
  };
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-75 shadow-lg rounded p-4 bg-white">
        {/* Colonne gauche : Texte d'information */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-4 text-white bg-success rounded">
          <h2 className="mb-3">Bienvenue !</h2>
          <p>
            Créez votre compte pour accéder à toutes nos fonctionnalités et
            gérer votre entreprise en toute simplicité.
          </p>
          <ul className="list-unstyled">
            <li>✔️ Gestion simplifiée</li>
            <li>✔️ Accès sécurisé</li>
            <li>✔️ Support 24/7</li>
          </ul>
        </div>

        {/* Colonne droite : Formulaire d'inscription */}
        <div className="col-md-6 p-4">
          <h2 className="text-center text-success mb-4">Créer un compte</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <FiUser className="me-2" />
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                className="form-control form-control-lg"
                placeholder="Entrez votre nom"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <FiMail className="me-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Entrez votre email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <FiPhone className="me-2" />
                Téléphone
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-control form-control-lg"
                placeholder="Votre numéro de téléphone"
                value={formData.phoneNumber}
                onChange={handleChange}
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
                name="password"
                className="form-control form-control-lg"
                placeholder="Créez un mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 py-2">
              Créer mon compte
            </button>

            <p className="mt-3 text-center">
              Déjà un compte ? <a href="/login">Se connecter</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;