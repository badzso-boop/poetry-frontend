import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

const BottomNavbar = () => {
  return (
    <nav className="navbar fixed-bottom navbar-dark bg-dark">
      <div className="container-fluid justify-content-center">
        <button className="btn btn-primary me-2">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </nav>
  );
};

export default BottomNavbar;
