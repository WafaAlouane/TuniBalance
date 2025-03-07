
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import Feature from '../components/Landing/Feature';
import Offer from '../components/Landing/Offer';

const BusinessOwnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center p-4 bg-primary text-white">
        <h2>Dashboard - {user?.name}</h2>
        <div>
          <Link to="/create-staff" className="btn btn-light">
            Créer un Staff
          </Link>
          <Link to="/profile" className="btn btn-light ms-2">
  Mon Profil
</Link>
          <button className="btn btn-light ms-2" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>
      {/* Section d'Introduction */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <h1>Welcome to your Business Dashboard</h1>
          <p>Manage your business with ease. Track your performance, monitor investments, and discover new opportunities.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-fluid feature pb-5">
        <Feature /> {/* Appel du composant Feature pour afficher les éléments de fonctionnalité */}
      </div>

      {/* Offer Section */}
      <div className="container-fluid offer-section pb-5">
        <Offer /> {/* Appel du composant Offer pour afficher les offres */}
      </div>

      {/* Section Statistiques (Optionnel) */}
      <div className="container-fluid bg-light py-5">
        <div className="container">
          <h3 className="text-center mb-4">Your Business Statistics</h3>
          <div className="row">
            <div className="col-md-4 text-center">
              <h4>Revenue</h4>
              <p className="display-4">$1,500,000</p>
            </div>
            <div className="col-md-4 text-center">
              <h4>Investments</h4>
              <p className="display-4">$500,000</p>
            </div>
            <div className="col-md-4 text-center">
              <h4>Growth Rate</h4>
              <p className="display-4">12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p>&copy; 2025 Business Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BusinessOwnerDashboard;
