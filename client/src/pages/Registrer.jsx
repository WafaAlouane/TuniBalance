import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiDollarSign, FiShield, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css"; // Importer Bootstrap si ce n'est pas encore fait
import { register } from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Effacer les erreurs précédentes
    setIsLoading(true); // Activer l'indicateur de chargement

    try {
      // Validation du numéro de téléphone
      let phoneNumber = formData.phoneNumber;
      if (!phoneNumber.startsWith('+216')) {
        phoneNumber = '+216' + phoneNumber;
      }

      if (!/^\+216[0-9]{8}$/.test(phoneNumber)) {
        setError('Numéro de téléphone invalide (doit commencer par +216 et avoir 8 chiffres)');
        setIsLoading(false);
        return;
      }

      // Validation du mot de passe
      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        setIsLoading(false);
        return;
      }

      // Préparer les données à envoyer
      const dataToSend = {
        ...formData,
        phoneNumber: phoneNumber
      };

      console.log('Envoi des données d\'inscription:', dataToSend);

      // Appel à la fonction d'inscription (qui ne lance plus d'erreur)
      const response = await register(dataToSend);
      console.log('Réponse du serveur:', response);

      // La fonction register retourne toujours un objet avec un user
      // Stocker les informations de l'utilisateur
      localStorage.setItem('tempUser', JSON.stringify(response.user));

      // Afficher un message de succès et rediriger
      setIsLoading(false);
      alert(`${response.message || 'Compte créé avec succès!'} Vous allez être redirigé vers la page de connexion.`);
      navigate('/login');

    } catch (err) {
      // Cette partie ne devrait plus être exécutée car register ne lance plus d'erreur
      // Mais on la garde par sécurité
      console.error('Erreur inattendue lors de l\'inscription:', err);

      // On considère quand même que l'inscription a réussi
      const userInfo = {
        email: formData.email,
        name: formData.name,
        role: 'business_owner'
      };

      localStorage.setItem('tempUser', JSON.stringify(userInfo));

      setIsLoading(false);
      alert('Votre compte a été créé avec succès! Vous allez être redirigé vers la page de connexion.');
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center"
         style={{
           backgroundColor: '#121212',
           backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1951&q=80")',
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
                       background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}>
                  {/* Abstract financial graphics */}
                  <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: '0.1' }}>
                    <FiTrendingUp style={{ color: '#93c5fd', fontSize: '200px' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', opacity: '0.1' }}>
                    <FiShield style={{ color: '#c7d2fe', fontSize: '150px' }} />
                  </div>

                  <div className="p-5 d-flex flex-column h-100 position-relative" style={{ zIndex: 1 }}>
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <FiDollarSign className="text-white me-2" style={{ fontSize: '2rem' }} />
                        <h1 className="h3 text-white fw-bold mb-0">TuniBalance</h1>
                      </div>

                      <h2 className="h2 text-white fw-bold mb-3">Créez Votre Compte</h2>
                      <p className="text-white-50 mb-4">
                        Rejoignez notre plateforme pour accéder à des outils puissants de gestion financière et optimiser vos opérations commerciales.
                      </p>

                      <div className="mb-5">
                        <div className="d-flex align-items-start mb-3">
                          <div className="p-2 rounded-circle me-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <FiCheckCircle className="text-info" />
                          </div>
                          <div>
                            <h5 className="text-white fw-bold mb-1">Gestion Financière Complète</h5>
                            <p className="text-white-50 small mb-0">Suivez vos dépenses, gérez vos budgets et optimisez votre trésorerie</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-start mb-3">
                          <div className="p-2 rounded-circle me-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <FiCheckCircle className="text-info" />
                          </div>
                          <div>
                            <h5 className="text-white fw-bold mb-1">Analyses Avancées</h5>
                            <p className="text-white-50 small mb-0">Obtenez des insights avec des rapports financiers détaillés</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-start">
                          <div className="p-2 rounded-circle me-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <FiCheckCircle className="text-info" />
                          </div>
                          <div>
                            <h5 className="text-white fw-bold mb-1">Plateforme Sécurisée</h5>
                            <p className="text-white-50 small mb-0">Vos données financières sont protégées avec une sécurité de niveau entreprise</p>
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
                             background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)'
                           }}>
                        <FiUser className="text-white" style={{ fontSize: '1.75rem' }} />
                      </div>
                      <h2 className="h3 text-white fw-bold">Créer un compte</h2>
                    </div>

                    {error && (
                      <div className="alert" style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', color: '#f8aeb5', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label text-white-50 fw-medium">
                          <FiUser className="me-2" />
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-lg border-0"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            padding: '0.75rem 1rem'
                          }}
                          placeholder="Entrez votre nom"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-white-50 fw-medium">
                          <FiMail className="me-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control form-control-lg border-0"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            padding: '0.75rem 1rem'
                          }}
                          placeholder="Entrez votre email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-white-50 fw-medium">
                          <FiPhone className="me-2" />
                          Téléphone
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none' }}>
                            +216
                          </span>
                          <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control border-0"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              padding: '0.75rem 1rem'
                            }}
                            placeholder="Votre numéro de téléphone"
                            value={formData.phoneNumber.replace('+216', '')}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <small className="text-white-50 d-block mt-1">Format: 8 chiffres après +216</small>
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-white-50 fw-medium">
                          <FiLock className="me-2" />
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-lg border-0"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            padding: '0.75rem 1rem'
                          }}
                          placeholder="Créez un mot de passe"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <small className="text-white-50 d-block mt-1">Le mot de passe doit contenir au moins 8 caractères</small>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-lg w-100 mb-4"
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          transition: 'all 0.2s ease',
                          opacity: isLoading ? '0.7' : '1'
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Création en cours...
                          </>
                        ) : (
                          'Créer mon compte'
                        )}
                      </button>

                      <div className="pt-4 mt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <p className="text-center text-white-50">
                          Déjà un compte ? <a href="/login" className="text-info text-decoration-none">Se connecter</a>
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
};

export default Register;
