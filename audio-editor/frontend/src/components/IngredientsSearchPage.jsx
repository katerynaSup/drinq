import React, { useState, useEffect } from 'react';
import IngredientCard from './IngredientCard';
import Bar from './Bar';
import '../styles/IngredientsSearchPage.css';
import ingredientsData from '../data/ingredients.json';
import defaultImage from '../../public/images/logo.png';


const IngredientsSearchPage = ({
    onGenerateDrinks
}) => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [barItems, setBarItems] = useState([]);
    const [isBarOpen, setIsBarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load ingredients from json file
    useEffect(() => {
        try {
            const uniqueIngredients = [];
            const idSet = new Set();

            ingredientsData.forEach(ingredient => {
                if (!idSet.has(ingredient.id)) {
                    idSet.add(ingredient.id);

                    // If image paths are already correct in the JSON, we can just use them directly
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

    // Load saved bar items from localStorage
    useEffect(() => {
        const savedBar = localStorage.getItem('ingredientBar');
        if (savedBar) {
            try {
                setBarItems(JSON.parse(savedBar));
            } catch (error) {
                console.error('Error loading saved bar:', error);
            }
        }
    }, []);

    // Save bar to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('ingredientBar', JSON.stringify(barItems));
    }, [barItems]);

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

    const handleAddToBar = (ingredient) => {
        // check if already in bar by ID
        if (!barItems.some(item => item.id === ingredient.id)) {
            const newBarItems = [...barItems, ingredient];
            setBarItems(newBarItems);
        } else {
            alert(`${ingredient.name} is already in your bar`);
        }
    };

    const handleRemoveFromBar = (ingredientId) => {
        setBarItems(barItems.filter(item => item.id !== ingredientId));
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
                    className={`button ${activeFilter.toLowerCase() === 'all' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All
                </button>
                <button
                    className={`button ${activeFilter.toLowerCase() === 'spirit' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('spirit')}
                >
                    Spirits
                </button>
                <button
                    className={`button ${activeFilter.toLowerCase() === 'juice' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('juice')}
                >
                    Juices
                </button>
                <button
                    className={`button ${activeFilter.toLowerCase() === 'syrup' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('syrup')}
                >
                    Syrups
                </button>
                <button
                    className={`button ${activeFilter.toLowerCase() === 'garnish' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('garnish')}
                >
                    Garnishes
                </button>
                <button
                    className={`button ${activeFilter.toLowerCase() === 'herb' ? 'primary-button' : 'secondary-button'}`}
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
                            onAddToBar={handleAddToBar}
                            isInBar={barItems.some(item => item.id === ingredient.id)}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No ingredients found matching your search.</p>
                    </div>
                )}
            </div>

            <Bar
                barItems={barItems}
                onRemoveItem={handleRemoveFromBar}
                isOpen={isBarOpen}
                onClose={() => setIsBarOpen(false)}
                onGenerateDrinks={onGenerateDrinks}
            />
        </div>
    );
};

export default IngredientsSearchPage;

