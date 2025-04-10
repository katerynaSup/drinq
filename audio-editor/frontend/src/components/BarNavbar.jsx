import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BarNavbar.css';
import logoImage from '../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWhiskey, faWineBottle, faMartiniGlassCitrus } from '@fortawesome/free-solid-svg-icons';


const BarNavbar = ({ barItemCount = 0, onBarClick }) => {
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
                    <button className="bar-button" onClick={onBarClick}>
                        <span className="bar-icon">🥃</span>
                        {barItemCount > 0 && (
                            <span className="bar-count">{barItemCount}</span>
                        )}
                        Bar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarNavbar; 