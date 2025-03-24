import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import "./Sidebar.css"; // Import du CSS

function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {/* Dashboard */}
        <li className="nav-item">
          <Link className="nav-link" to="/comptable">
            <i className="bi bi-grid" />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Gestion des utilisateurs */}
        {user && (
          <>
            <li className="nav-item">
  <Link className="nav-link" to="/comptable/profile">
    <i className="bi bi-person" />
    <span>Mon Profil</span>
  </Link>
</li>


          </>
        )}


        {/* Déconnexion */}
        {user && (
          <li className="nav-item">
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" />
              <span>Déconnexion</span>
            </button>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;