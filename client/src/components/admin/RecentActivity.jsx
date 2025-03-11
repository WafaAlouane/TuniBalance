import React from 'react';
import styles from './admin.module.css'; // Import CSS Module

function RecentActivity() {
  return (
    <div>
      {/* Recent Activity */}
      <div className={styles.card}>
        <div className={styles.filter}>
          <a className={styles.icon} href="#" data-bs-toggle="dropdown">
            <i className="bi bi-three-dots" />
          </a>
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
          <h5 className={styles.cardTitle}>Recent Activity <span>| Today</span></h5>
          <div className={styles.activity}>
            {[
              { time: '32 min', text: 'Quia quae rerum ', link: 'explicabo officiis', color: 'text-success' },
              { time: '56 min', text: 'Voluptatem blanditiis blanditiis eveniet', color: 'text-danger' },
              { time: '2 hrs', text: 'Voluptates corrupti molestias voluptatem', color: 'text-primary' },
              { time: '1 day', text: 'Tempore autem saepe ', link: 'occaecati voluptatem', color: 'text-info' },
              { time: '2 days', text: 'Est sit eum reiciendis exercitationem', color: 'text-warning' },
              { time: '4 weeks', text: 'Dicta dolorem harum nulla eius. Ut quidem quidem sit quas', color: 'text-muted' }
            ].map((activity, index) => (
              <div className={`${styles.activityItem} d-flex`} key={index}>
                <div className={styles.activiteLabel}>{activity.time}</div>
                <i className={`bi bi-circle-fill ${activity.color} align-self-start ${styles.activityBadge}`} />
                <div className={styles.activityContent}>
                  {activity.text}
                  {activity.link && (
                    <a href="#" className="fw-bold text-dark"> {activity.link}</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{/* End Recent Activity */}
    </div>
  );
}

export default RecentActivity;
