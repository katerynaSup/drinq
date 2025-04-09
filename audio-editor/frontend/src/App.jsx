import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import PreferenceForm from './components/PreferenceForm';
import PhoneFrame from './components/PhoneFrame';
import BarNavbar from './components/BarNavbar';
import IngredientsSearchPage from './components/IngredientsSearchPage';

// Placeholder components - you'll create these later
const HomePage = () => {
    return (
        <div className="home-container">
            <header>
                <h1>Bar Drink Explorer</h1>
                <p>Discover the perfect drink for any occasion</p>
            </header>

            <div className="action-cards">
                <div className="action-card">
                    <h2>Find by Preference</h2>
                    <p>Tell us what you like, and we'll recommend the perfect drink.</p>
                    <a href="/preferences" className="button primary-button">Start Quiz</a>
                </div>

                <div className="action-card">
                    <h2>Search by Ingredients</h2>
                    <p>Have specific ingredients? Find drinks you can make right now.</p>
                    <a href="/ingredients" className="button primary-button">Search</a>
                </div>

                <div className="action-card">
                    <h2>Browse Popular Drinks</h2>
                    <p>Explore classic and trending cocktails from around the world.</p>
                    <a href="/explore" className="button primary-button">Explore</a>
                </div>
            </div>

            <div className="featured-section">
                <h2>Featured This Week</h2>
                <div className="featured-drinks">
                    <div className="featured-drink">
                        <img src="/images/drinks/mojito.jpg" alt="Mojito" />
                        <h3>Mojito</h3>
                        <p>A refreshing Cuban classic with rum, mint, and lime</p>
                    </div>
                    <div className="featured-drink">
                        <img src="/images/drinks/old-fashioned.jpg" alt="Old Fashioned" />
                        <h3>Old Fashioned</h3>
                        <p>A timeless whiskey cocktail that's simple yet sophisticated</p>
                    </div>
                    <div className="featured-drink">
                        <img src="/images/drinks/margarita.jpg" alt="Margarita" />
                        <h3>Margarita</h3>
                        <p>The quintessential tequila cocktail with citrus and salt</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RecommendationsPage = ({ recommendations }) => {
    return (
        <div className="recommendations-container">
            <h1>Your Personalized Recommendations</h1>
            {recommendations && recommendations.length > 0 ? (
                <div className="recommendations-list">
                    {recommendations.map(drink => (
                        <div key={drink.id} className="drink-card">
                            <img src={drink.image_url || "/images/drinks/default.jpg"} alt={drink.name} />
                            <h2>{drink.name}</h2>
                            <p>{drink.description}</p>
                            <a href={`/drinks/${drink.id}`} className="button">View Recipe</a>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No recommendations yet. Try adjusting your preferences!</p>
            )}
        </div>
    );
};

function App() {
    const [recommendations, setRecommendations] = useState([]);

    const handlePreferenceSubmit = async (preferences) => {
        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            setRecommendations(data);
            // Navigate programmatically or use useNavigate in the component
            window.location.href = '/recommendations';
        } catch (error) {
            console.error('Error getting recommendations:', error);
        }
    };

    return (
        <Router>
            <PhoneFrame>
                <div className="app-container">
                    <BarNavbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/preferences"
                            element={<PreferenceForm onSubmit={handlePreferenceSubmit} />}
                        />
                        <Route
                            path="/recommendations"
                            element={<RecommendationsPage recommendations={recommendations} />}
                        />
                        <Route path="/ingredients" element={<IngredientsSearchPage />} />
                        <Route path="/explore" element={<div>Explore Drinks (Coming Soon)</div>} />
                        <Route path="/drinks/:id" element={<div>Individual Drink Detail (Coming Soon)</div>} />
                    </Routes>
                </div>
            </PhoneFrame>
        </Router>
    );
}

export default App;