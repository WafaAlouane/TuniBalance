import React from "react";
<<<<<<< HEAD

const AdminDashboard = () => {
  return (
    <div>
      <h1>Tableau de bord Administrateur</h1>
      <p>Bienvenue sur votre tableau de bord d'administration!</p>
    </div>
  );
};

export default AdminDashboard;
=======
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import Header from "../components/admin/Headeradmin";
import Sidebar from "../components/admin/sideadmin";
import Footer from "../components/admin/Footer";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Récupère l'utilisateur connecté

  const handleLogout = () => {
    dispatch(logout());
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
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
