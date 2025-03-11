import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';

function BusinessOwner() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Récupère l'utilisateur connecté

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} /> {/* Passe l'utilisateur au Header */}
      <div style={{ display: 'flex' }}>
        <Sidebar user={user} /> {/* Passe l'utilisateur au Sidebar */}
        <div style={{ flex: 1, padding: '20px' }}> 
          <Outlet /> {/* Ici seront affichées les pages */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BusinessOwner;
