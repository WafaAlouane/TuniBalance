import React from 'react';
import styles from './admin.module.css'; // Import the CSS module

function Cards() {
  return (
    <div>
      {/* Sales Card */}
      <div className="col-xxl-4 col-md-6">
        <div className={`${styles.card} info-card sales-card`}>
          <div className={styles.filter}>
            <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li><a className="dropdown-item" href="#">Today</a></li>
              <li><a className="dropdown-item" href="#">This Month</a></li>
              <li><a className="dropdown-item" href="#">This Year</a></li>
            </ul>
          </div>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>Sales <span>| Today</span></h5>
            <div className="d-flex align-items-center">
              <div className={`${styles.cardIcon} rounded-circle d-flex align-items-center justify-content-center`}>
                <i className="bi bi-cart" />
              </div>
              <div className={styles.ps3}>
                <h6>145</h6>
                <span className="text-success small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">increase</span>
              </div>
            </div>
          </div>
        </div>
      </div> {/* End Sales Card */}

      {/* Revenue Card */}
      <div className="col-xxl-4 col-md-6">
        <div className={`${styles.card} info-card revenue-card`}>
          <div className={styles.filter}>
            <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li><a className="dropdown-item" href="#">Today</a></li>
              <li><a className="dropdown-item" href="#">This Month</a></li>
              <li><a className="dropdown-item" href="#">This Year</a></li>
            </ul>
          </div>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>Revenue <span>| This Month</span></h5>
            <div className="d-flex align-items-center">
              <div className={`${styles.cardIcon} rounded-circle d-flex align-items-center justify-content-center`}>
                <i className="bi bi-currency-dollar" />
              </div>
              <div className={styles.ps3}>
                <h6>$3,264</h6>
                <span className="text-success small pt-1 fw-bold">8%</span> <span className="text-muted small pt-2 ps-1">increase</span>
              </div>
            </div>
          </div>
        </div>
      </div> {/* End Revenue Card */}

      {/* Customers Card */}
      <div className="col-xxl-4 col-xl-12">
        <div className={`${styles.card} info-card customers-card`}>
          <div className={styles.filter}>
            <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li><a className="dropdown-item" href="#">Today</a></li>
              <li><a className="dropdown-item" href="#">This Month</a></li>
              <li><a className="dropdown-item" href="#">This Year</a></li>
            </ul>
          </div>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>Customers <span>| This Year</span></h5>
            <div className="d-flex align-items-center">
              <div className={`${styles.cardIcon} rounded-circle d-flex align-items-center justify-content-center`}>
                <i className="bi bi-people" />
              </div>
              <div className={styles.ps3}>
                <h6>1244</h6>
                <span className="text-danger small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">decrease</span>
              </div>
            </div>
          </div>
        </div>
      </div> {/* End Customers Card */}
    </div>
  );
}

export default Cards;
