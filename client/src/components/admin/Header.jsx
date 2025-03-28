import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import styles from './admin.module.css';

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header id="header" className={`${styles.header} fixed-top d-flex align-items-center`}>
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className={`${styles.logo} d-flex align-items-center`}>
          <img src="/admin/assets/img/logo.png" alt="Logo" />
          <span className="d-none d-lg-block">Business Owner</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn" />
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-bell" />
              <span className="badge bg-primary badge-number">4</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
              <li className="dropdown-header">
                You have 4 new notifications
                <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
              </li>
              <li>
                <Link to="/profile" className="dropdown-item d-flex align-items-center">
                  <i className="bi bi-person" />
                  <span>Mon Profil</span>
                </Link>
              </li>
              <li>
                <Link to="/create-staff" className="dropdown-item d-flex align-items-center">
                  <i className="bi bi-person-plus" />
                  <span>Créer un Staff</span>
                </Link>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right" />
                  <span>Déconnexion</span>
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
<<<<<<< HEAD
              <li className="notification-item">
                <i className="bi bi-exclamation-circle text-warning" />
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>30 min. ago</p>
                </div>
              </li>
=======
              
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
            </ul>
          </li>

          <li className="nav-item dropdown">
            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
              <span className="d-none d-md-block dropdown-toggle ps-2">{user?.name}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header text-center">
                <h6>{user?.name}</h6>
                <span>Business Owner</span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <Link to="/profile" className="dropdown-item d-flex align-items-center">
                  <i className="bi bi-person" />
                  <span>Mon Profil</span>
                </Link>
              </li>
              <li>
                <Link to="/create-staff" className="dropdown-item d-flex align-items-center">
                  <i className="bi bi-person-plus" />
                  <span>Créer un Staff</span>
                </Link>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right" />
                  <span>Déconnexion</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
