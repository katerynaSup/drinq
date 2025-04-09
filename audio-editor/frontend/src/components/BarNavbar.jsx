import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BarNavbar.css';
import logoImage from '../../public/images/logo/drinq_transparent_cropped.png';

const BarNavbar = ({ cartItemCount = 0, onCartClick }) => {
    return (
        <div className="bar-navbar">
            <div className="navbar-inner">
                <div className="bar-logo">
                    <Link to="/">
                        <img src={logoImage} className="logo-image" alt="Bar Drink Explorer"/>
                    </Link>
                </div>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/preferences" className="nav-link">Find Drinks</Link>
                    <Link to="/ingredients" className="nav-link">By Ingredient</Link>
                    <Link to="/explore" className="nav-link">Explore</Link>
                    <button className="cart-button" onClick={onCartClick}>
                        <span className="cart-icon">🛒</span>
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                        Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarNavbar; 