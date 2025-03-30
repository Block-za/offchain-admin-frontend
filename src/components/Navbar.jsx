import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Blockza Admin Panel</Link>
      <div className="navbar-login">
        <button className="login-button" onClick={() => navigate('/auth')}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
