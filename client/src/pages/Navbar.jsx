import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // Action pour se déconnecter

function Navbar() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Déconnexion
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Accueil</Link>
      {!token ? (
        <>
          <Link to="/login" style={{ marginLeft: "10px" }}>Se connecter</Link>
          <Link to="/register" style={{ marginLeft: "10px" }}>S'inscrire</Link>
        </>
      ) : (
        <>
          <Link to="/DashboardBusinessOwner" style={{ marginLeft: "10px" }}>Dashboard</Link>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Se déconnecter</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
