import React, { useState } from 'react';
import { register } from '../services/authService'; // Assure-toi d'importer ta fonction de registre
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError('Numéro de téléphone invalide (10 chiffres requis)');
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
    <div className="container-fluid register py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 col-12">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <h4 className="text-center mb-4">Créer un nouveau compte</h4>
                
                {error && <div className="alert alert-danger">{error}</div>}

                {/* SUPPRIMER UNE DES BALISES FORM */}
                <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
                  {/* Champ Nom */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Votre nom complet"
                      pattern=".{3,}"
                      title="Minimum 3 caractères"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Champ Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Adresse Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="exemple@entreprise.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Champ Téléphone */}
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="0612345678"
                      pattern="[0-9]{10}"
                      title="10 chiffres sans espaces"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, phoneNumber: value.slice(0, 10)});
                      }}
                      required
                    />
                  </div>

                  {/* Champ Mot de passe */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
                    Devenir Business Owner
                  </button>

                  <div className="text-center">
                    <p className="mb-0">Vous avez déjà un compte ? <a href="/login" className="text-decoration-none">Se connecter</a></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
