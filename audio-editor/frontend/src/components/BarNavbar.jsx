import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/BarNavbar.css';
import logoImage from '../../public/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWhiskey, faWineBottle, faMartiniGlassCitrus, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';

const BarNavbar = ({ barItemCount = 0, onBarClick }) => {
    return (
        <div className="bar-navbar">
            <div className="navbar-inner">
                <div className="bar-logo">
                    <Link to="/">
                        <img src={logoImage} className="logo-image" alt="Bar Drink Explorer" />
                    </Link>
                </div>
                <div className="navbar-links">
                <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/ingredients" className="nav-link">Ingredients</NavLink>
                    <NavLink to="/drinks" className="nav-link">Drinks</NavLink>
                    <NavLink to="/ai-bartender" className="nav-link ai-bartender-link">
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="ai-icon" />
                        AI Bartender
                    </NavLink>
                    <button className="bar-button" onClick={onBarClick}>
                        <span className="bar-icon">🥃</span>
                        {barItemCount > 0 && (
                            <span className="bar-count">{barItemCount}</span>
                        )}
                        <span className="bar-text">Bar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarNavbar; 