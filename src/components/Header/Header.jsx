// src/components/Header/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file for styling

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className={"header-text"}>Marcus Store</h1>
                <nav className="nav-buttons">
                    <Link to="/" className="nav-button home-button">Home</Link>
                    <Link to="/admin" className="nav-button admin-button">Admin</Link>
                    <Link to="/cart" className="nav-button cart-button">Cart</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
