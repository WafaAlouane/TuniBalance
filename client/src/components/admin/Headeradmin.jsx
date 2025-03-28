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
          <span className="d-none d-lg-block">Admin</span>
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
              
            </ul>
          </li>

          
        </ul>
      </nav>
    </header>
  );
}

export default Header;
