import React from 'react';
import styles from './admin.module.css'; // Import the CSS module

function Footer() {
  return (
    <div>
      <footer id="footer" className={styles.footer}>
        <div className={styles.copyright}>
          © Copyright <strong><span>NiceAdmin</span></strong>. All Rights Reserved
        </div>
        <div className={styles.credits}>
          {/* All the links in the footer should remain intact. */}
          {/* You can delete the links only if you purchased the pro version. */}
          {/* Licensing information: https://bootstrapmade.com/license/ */}
          {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ */}
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
