import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { ThemeContext } from '../components/context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || localStorage.getItem('role');
  const username = user?.username || 'Guest';
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">🎬 MovieApp</div>
          {token && (
            <div className="user-info">
              <span>{username}</span>
              <span className="user-role">({role})</span>
            </div>
          )}
        </div>

        <button className="burger" onClick={toggleMenu} aria-label="Меню">☰</button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>

          {!token && (
            <>
              <li><NavLink to="/register" onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink></li>
              <li><NavLink to="/login" onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
            </>
          )}

          {token && (
            <>
              <li><NavLink to="/profile" onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>
              <li><NavLink to="/favorites" onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Favorites</NavLink></li>

              {(role === 'admin' || role === 'critic') && (
                <li><NavLink to="/add-movie" onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Add Movie</NavLink></li>
              )}

              {role === 'admin' && (
                <li><NavLink to="/admin" onClick={toggleMenu} className={({ isActive }) => isActive ? 'active' : ''}>Admin Panel</NavLink></li>
              )}
            </>
          )}
        </ul>

        {token && (
          <div className="navbar-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
