import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import "../styles/IngredientsSearchPage.css";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="hero-section">
                <h1 className="hero-title">Bar Drink Explorer</h1>
                <p className="hero-subtitle">Discover and mix the perfect drinks with ingredients you have</p>

            </div>

            <div className="feature-section">

                <div className="feature-card">
                    <div className="feature-icon">🥄</div>
                    <h3>Browse Ingredients</h3>
                    <p>Add ingredients from your home bar and discover drinks you can make right now.</p>
                    <Link to="/ingredients" className="feature-button">Search Ingredients</Link>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">✨</div>
                    <h3>Get Creative</h3>
                    <p>Generate custom drink recipes with AI based on ingredients you select.</p>
                    <Link to="/ai-bartender" className="feature-button">Generate Recipe</Link>
                </div>
            </div>

            <div className="popular-section">
                <h2>Popular Drinks</h2>
                <div className="popular-drinks">
                    <Link to="/drinks/mojito" className="popular-drink-card">
                        <div className="popular-drink-image">🍹</div>
                        <h3>Mojito</h3>
                    </Link>

                    <Link to="/drinks/margarita" className="popular-drink-card">
                        <div className="popular-drink-image">🧉</div>
                        <h3>Margarita</h3>
                    </Link>

                    <Link to="/drinks/paloma" className="popular-drink-card">
                        <div className="popular-drink-image">🥃</div>
                        <h3>Paloma</h3>
                    </Link>

                    <Link to="/drinks/cosmopolitan" className="popular-drink-card">
                        <div className="popular-drink-image">🍸</div>
                        <h3>Cosmopolitan</h3>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage; 