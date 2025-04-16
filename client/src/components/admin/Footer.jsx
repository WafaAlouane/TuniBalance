import React from 'react';

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-4 px-6 z-40">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="text-gray-400 text-sm mb-2 md:mb-0">
          © Copyright <strong className="text-gray-300">NiceAdmin</strong>. All Rights Reserved
        </div>
        <div className="text-gray-500 text-xs">
          Designed by{' '}
          <a 
            href="https://bootstrapmade.com/" 
            className="text-gray-400 hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            BootstrapMade
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;