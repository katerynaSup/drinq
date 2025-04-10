import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './styles/App.css';
import PreferenceForm from './components/PreferenceForm';
import BarNavbar from './components/BarNavbar';
import IngredientsSearchPage from './components/IngredientsSearchPage';
import IngredientRecommendationsPage from './components/IngredientRecommendationsPage';

// Placeholder components - you'll create these later
const HomePage = () => {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Bar Drink Explorer</h1>
                <p>Discover the perfect drink for any occasion</p>
            </div>

            <div className="grid-layout">
                <div className="card">
                    <div className="card-content">
                        <h2>Find by Preference</h2>
                        <p>Tell us what you like, and we'll recommend the perfect drink.</p>
                        <a href="/preferences" className="button primary-button">Start Quiz</a>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <h2>Search by Ingredients</h2>
                        <p>Have specific ingredients? Find drinks you can make right now.</p>
                        <a href="/ingredients" className="button primary-button">Search</a>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <h2>Browse Popular Drinks</h2>
                        <p>Explore classic and trending cocktails from around the world.</p>
                        <a href="/explore" className="button primary-button">Explore</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RecommendationsPage = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>Recommendations</h1>
                    <p>No recommendations yet. Please fill out the preferences form.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Your Recommended Drinks</h1>
            </div>
            <div className="grid-layout">
                {recommendations.map(drink => (
                    <div key={drink.id} className="card">
                        <img src={drink.image} alt={drink.name} className="card-image" />
                        <div className="card-content">
                            <h2>{drink.name}</h2>
                            <p>{drink.description}</p>
                            <a href={`/drinks/${drink.id}`} className="button primary-button">View Recipe</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    const [recommendations, setRecommendations] = useState([]);
    const [barItems, setBarItems] = useState([]);
    const [isBarOpen, setIsBarOpen] = useState(false);
    
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

    // Function to handle bar button click
    const handleBarClick = () => {
        setIsBarOpen(true);
    };

    // Function to handle generating recommendations from bar ingredients
    const handleGenerateDrinks = () => {
        // Navigate to recommendations page with the bar items
        window.location.href = `/ingredient-recommendations?ingredients=${barItems.map(item => item.id).join(',')}`;
        setIsBarOpen(false);
    };

    return (
        <Router>
            <div className="app-container">
                <BarNavbar 
                    barItemCount={barItems.length} 
                    onBarClick={handleBarClick} 
                />
                <main className="main-content">
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
                        <Route 
                            path="/ingredients" 
                            element={
                                <IngredientsSearchPage 
                                    barItems={barItems}
                                    setBarItems={setBarItems}
                                    isBarOpen={isBarOpen}
                                    setIsBarOpen={setIsBarOpen}
                                    onGenerateDrinks={handleGenerateDrinks}
                                />
                            } 
                        />
                        <Route path="/explore" element={<div className="page-container">Explore Drinks (Coming Soon)</div>} />
                        <Route path="/drinks/:id" element={<div className="page-container">Individual Drink Detail (Coming Soon)</div>} />
                        <Route path="/ingredient-recommendations" element={<IngredientRecommendationsPage />} />
                    </Routes>
                </main>
                <footer className="site-footer">
                    <p>&copy; {new Date().getFullYear()} Bar Drink Explorer</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;