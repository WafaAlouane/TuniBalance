import React from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import Header from "../components/admin/Headeradmin";
import Sidebar from "../components/admin/sideadmin";
import Footer from "../components/admin/Footer";
import {useNavigate } from "react-router-dom"


  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };
  

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Récupère l'utilisateur connecté

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); 
    
  };
  

  // Si l'utilisateur n'est pas un admin, rediriger vers une autre page ou montrer un message
  if (user?.role !== "admin") {
    return <div>Accès interdit - Vous devez être un administrateur</div>;
  }

  return (
    <div>
      <Header user={user} onLogout={handleLogout} /> {/* Passe l'utilisateur au Header */}
      <div style={{ display: "flex" }}>
        <Sidebar user={user} /> {/* Passe l'utilisateur au Sidebar */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet /> {/* Ici seront affichées les pages */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
