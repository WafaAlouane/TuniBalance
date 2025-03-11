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
          <Link className="nav-link" to="/dashboard">
            <i className="bi bi-grid" />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Gestion des utilisateurs */}
        {user && (
          <>
            <li className="nav-item">
  <Link className="nav-link" to="/BusinessOwner/profile">
    <i className="bi bi-person" />
    <span>Mon Profil</span>
  </Link>
</li>

<li className="nav-item">
  <Link className="nav-link" to="/BusinessOwner/create-staff">
    <i className="bi bi-person-plus" />
    <span>Créer un Staff</span>
  </Link>
</li>
          </>
        )}

        {/* Navigation pour les composants */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-menu-button-wide" />
            <span>Components</span>
            <i className="bi bi-chevron-down ms-auto" />
          </a>
          <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/components-alerts">
                <i className="bi bi-circle" />
                <span>Alerts</span>
              </Link>
            </li>
            <li>
              <Link to="/components-buttons">
                <i className="bi bi-circle" />
                <span>Buttons</span>
              </Link>
            </li>
            <li>
              <Link to="/components-cards">
                <i className="bi bi-circle" />
                <span>Cards</span>
              </Link>
            </li>
          </ul>
        </li>

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
