import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/DrinksPage.css';
import drinksData from '../data/drinks.json';

// Export the drinks data for use in other components
export const DRINKS_DATA = drinksData;

const DrinksPage = () => {
    const [drinks, setDrinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        try {
            // Use the local data directly
            setDrinks(drinksData);
            setLoading(false);
        } catch (err) {
            console.error('Error loading drinks data:', err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    // Filter drinks based on search term and active filter
    const filteredDrinks = drinks.filter(drink => {
        const matchesSearch = searchTerm === '' ||
            drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drink.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = activeFilter === 'all' ||
            (activeFilter === 'spirit' && drink.alcohol_content > 0) ||
            (activeFilter === 'non-alcoholic' && drink.alcohol_content === 0);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="loading-container">Loading drinks...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Drink Explorer</h1>
                <p>Discover cocktails and mixed drinks from our collection</p>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search drinks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="filter-tabs">
                <button
                    className={`button ${activeFilter === 'all' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All Drinks
                </button>
                <button
                    className={`button ${activeFilter === 'spirit' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('spirit')}
                >
                    Spirit-based
                </button>
                <button
                    className={`button ${activeFilter === 'non-alcoholic' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('non-alcoholic')}
                >
                    Non-Alcoholic
                </button>
            </div>

            <div className="grid-layout">
                {filteredDrinks.length > 0 ? (
                    filteredDrinks.map(drink => (
                        <Link to={`/drinks/${drink.id}`} key={drink.id} className="drink-card-link">
                            <div className="card">
                                <img
                                    src={drink.image_url || `/images/drinks/${drink.id}.jpg`}
                                    alt={drink.name}
                                    className="card-image"
                                    onError={(e) => {
                                        e.target.src = '/images/drinks/default.jpg';
                                    }}
                                />
                                <div className="card-content">
                                    <h2 className="body-text">{drink.name}</h2>
                                    <p className="drink-description">{drink.description}</p>
                                    <div className="drink-info">
                                        <span className="drink-glass">{drink.glass}</span>
                                        <span className="ingredient-count">
                                            {drink.ingredients.length} ingredients
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No drinks found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrinksPage; 