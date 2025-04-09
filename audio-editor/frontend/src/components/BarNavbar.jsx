import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BarNavbar.css';
import logoImage from '../../public/images/logo/drinq_transparent_cropped.png';

const BarNavbar = () => {
    return (
        <div className="bar-navbar">
            <div className="bar-logo">
                <img src={logoImage} className="logo-image" />
            </div>
            <div className="navbar-links">
                <Link to="/preferences" className="nav-link">Find Drinks</Link>
                <Link to="/ingredients" className="nav-link">By Ingredient</Link>
                <Link to="/explore" className="nav-link">Explore</Link>
            </div>
        </div>
    );
};

export default BarNavbar; 