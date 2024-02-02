import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import '../App.css';

const AppNavbar = () => {
  const { user, userId, setUser, setUserId } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);

  const handleNavbarToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavItemClick = () => {
    setExpanded(false);
  };

  const handleOutsideClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setExpanded(false);
    }
  };

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(apiUrl + '/auth/logout', {
        method: 'GET',
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres kijelentkezés, null értéket állítunk be a felhasználói információknál
        setUser(null);
        console.log('Logout successful');
        setUserId(null);
      } else {
        // Sikertelen kijelentkezés, kezelheted a választ itt
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <Navbar
      bg="barna"
      variant="dark"
      expand="lg"
      className='p-3 barna'
      expanded={expanded}
      onToggle={handleNavbarToggle}
      ref={navbarRef}
    >
      <Navbar.Brand as={Link} to="/" onClick={handleNavItemClick}>Verseim</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="w-100 justify-content-between">
          <Nav>
            <Nav.Link as={Link} to="/" onClick={handleNavItemClick}>
              Főoldal
            </Nav.Link>
            <Nav.Link as={Link} to="/poems" onClick={handleNavItemClick}>
              Versek
            </Nav.Link>
            <Nav.Link as={Link} to="/albums" onClick={handleNavItemClick}>
              Albumok
            </Nav.Link>
          </Nav>
          <Nav className={`d-none d-lg-block ${user ? '' : 'd-none'}`}>
            {user && (
              <>
                <span className="navbar-text d-flex justify-content-center align-items-center">
                  Üdvözöllek, {user.username}!
                </span>
              </>
            )}
          </Nav>
          <Nav>
            
              {user ? (
                <>
                  <Nav.Link as={Link} to="/profile" onClick={handleNavItemClick}>Profilom</Nav.Link>
                  <Nav.Link as={Link} to="/uploadpoem" onClick={handleNavItemClick}>Vers feltöltése</Nav.Link>
                  <Nav.Link as={Link} to="/uploadalbum" onClick={handleNavItemClick}>Album feltöltése</Nav.Link>
                  <span className="navbar-text nav-hover me-2" style={{ cursor: 'pointer' }} onClick={handleLogout}>Kilépés</span>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" onClick={handleNavItemClick}>
                    Belépés
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" onClick={handleNavItemClick}>
                    Regisztráció
                  </Nav.Link>
                </>
              )}
          </Nav>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
  
};

export default AppNavbar;
