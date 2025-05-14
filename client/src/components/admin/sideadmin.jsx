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
       
        {/* Gestion des utilisateurs */}
        {user && (
          <>
        
        <Link className="nav-link" to="/AdminDashboard/viewBO">
  <i className="bi bi-person-plus" />
  <span>Voir utilisateurs</span>
</Link>


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