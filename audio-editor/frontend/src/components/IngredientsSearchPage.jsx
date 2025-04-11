import React, { useState, useEffect } from 'react';
import IngredientCard from './IngredientCard';
import '../styles/IngredientsSearchPage.css';
import ingredientsData from '../data/ingredients.json';
import { useNavigate } from 'react-router-dom';

const IngredientsSearchPage = ({
    onAddToBar,
    barItems,
    onRemoveFromBar,
    onGenerateDrinks
}) => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Load ingredients from json file
    useEffect(() => {
        try {
            const uniqueIngredients = [];
            const idSet = new Set();

            ingredientsData.forEach(ingredient => {
                if (!idSet.has(ingredient.id)) {
                    idSet.add(ingredient.id);
                    uniqueIngredients.push(ingredient);
                } else {
                    console.warn(`Duplicate ingredient ID found: ${ingredient.id}`);
                }
            });

            setIngredients(uniqueIngredients);
            setFilteredIngredients(uniqueIngredients);
            setLoading(false);
        } catch (err) {
            console.error('Error loading ingredients:', err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    // Filtering logic
    useEffect(() => {
        let results = ingredients;

        // type filter with more precise matching for spirits
        if (activeFilter.toLowerCase() !== 'all') {
            // For spirit filter, match exactly "Spirit" type (case insensitive)
            if (activeFilter.toLowerCase() === 'spirit') {
                results = results.filter(ingredient => {
                    return ingredient.type &&
                        ingredient.type.toLowerCase() === 'spirit' &&
                        ingredient.alcohol_content >= 20;
                });
            } else {
                results = results.filter(ingredient =>
                    ingredient.type && ingredient.type.toLowerCase() === activeFilter.toLowerCase()
                );
            }
        }

        // search term filtering remains the same
        if (searchTerm) {
            results = results.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ingredient.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredIngredients(results);
    }, [searchTerm, ingredients, activeFilter]);

    const handleGenerateRecommendations = () => {
        navigate('/recommendationPage', {
            state: { ingredients: selectedIngredients }
        });
    };

    if (loading) {
        return <div className="loading-container">Loading ingredients...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Ingredient Search</h1>
                <p>Find ingredients to make your perfect drink</p>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${activeFilter.toLowerCase() === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-tab ${activeFilter.toLowerCase() === 'spirit' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('spirit')}
                >
                    Spirits
                </button>
                <button
                    className={`filter-tab ${activeFilter.toLowerCase() === 'juice' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('juice')}
                >
                    Juices
                </button>
                <button
                    className={`filter-tab ${activeFilter.toLowerCase() === 'syrup' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('syrup')}
                >
                    Syrups
                </button>
                <button
                    className={`filter-tab ${activeFilter.toLowerCase() === 'garnish' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('garnish')}
                >
                    Garnishes
                </button>
                <button
                    className={`filter-tab ${activeFilter.toLowerCase() === 'herb' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('herb')}
                >
                    Herbs
                </button>
            </div>

            <div className="grid-layout">
                {filteredIngredients.length > 0 ? (
                    filteredIngredients.map(ingredient => (
                        <IngredientCard
                            key={ingredient.id}
                            ingredient={ingredient}
                            onAddToBar={onAddToBar}
                            isInBar={barItems.some(item => item.id === ingredient.id)}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No ingredients found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngredientsSearchPage;

