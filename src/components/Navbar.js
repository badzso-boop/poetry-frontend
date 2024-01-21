import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import '../App.css'

const AppNavbar = () => {
  const { user, userId, setUserId, setUser } = useContext(AppContext);
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
      const response = await fetch(apiUrl+'/auth/logout', {
        method: 'GET',
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres kijelentkezés, null értéket állítunk be a felhasználói információknál
        setUser(null);
        console.log('Logout successful');
        setUserId(null)
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
      bg="dark"
      variant="dark"
      expand="lg"
      className='p-3'
      expanded={expanded}
      onToggle={handleNavbarToggle}
      ref={navbarRef}
    >
      <Navbar.Brand as={Link} to="/" onClick={handleNavItemClick}>Verseim</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="ml-auto">
          {user && (
            <span className="navbar-text">
              Üdvözöllek, {user.username}!
            </span>
          )}
          <Nav.Link as={Link} to="/" onClick={handleNavItemClick}>
            Főoldal
          </Nav.Link>
          <Nav.Link as={Link} to="/poems" onClick={handleNavItemClick}>
            Versek
          </Nav.Link>
          <Nav.Link as={Link} to="/albums" onClick={handleNavItemClick}>
            Albumok
          </Nav.Link>

          {userId ? (
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
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
