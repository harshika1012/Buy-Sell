import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import CSS file for styling
import App from './App';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{top: '0', position: 'sticky', left: '0', width: '100%'}}>
    <nav className="navbar" >
      <div className="navbar-container">
        {/* <p className="navbar-logo"></p> */}
        <button className="hamburger" onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {/* <li>
            <Link to="/Dashboard" onClick={() => setIsOpen(false)}>Hello</Link>
          </li> */}
          <li>
            <Link to="/Profile" onClick={() => setIsOpen(false)}>Profile</Link>
          </li>
          <li>
            {/* <Link to="/Search_items" onClick={() => setIsOpen(false)}>Search</Link> */}
          </li>
          <li>
            <Link to="/AddItems" onClick={() => setIsOpen(false)}>AddItems</Link>
          </li>
          <li>
            <Link to="/Items" onClick={() => setIsOpen(false)}>Search</Link>
          </li>
          <li>
            <Link to="/Orders_History" onClick={() => setIsOpen(false)}>Orders</Link>
          </li>
          <li>
            <Link to="/Deliver_items" onClick={() => setIsOpen(false)}>Deliver</Link>
          </li>
          <li>
            <Link to="/My_Cart" onClick={() => setIsOpen(false)}>Cart</Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setIsOpen(false)}>LogOut</Link>
          </li>
        </ul>
      </div>
    </nav>
    </div>
  );
}

export default Navbar;

