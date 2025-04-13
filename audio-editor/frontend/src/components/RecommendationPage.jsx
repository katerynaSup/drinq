import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/RecommendationPage.css';
import '../styles/DrinkDetailPage.css';
import DRINK_DATA from '../data/drinks.json';
import '../styles/App.css';

// Mock drink data - in a real app, this would come from an API or imported JSON

const RecommendationPage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const barIngredients = location.state?.ingredients || [];

    useEffect(() => {
        const matchDrinksWithIngredients = () => {
            setLoading(true);
            try {
                // If no ingredients, return empty list
                if (barIngredients.length === 0) {
                    setRecommendations([]);
                    setLoading(false);
                    return;
                }

                console.log("Matching drinks with ingredients:", barIngredients);

                // Match drinks with user's ingredients
                const matchedDrinks = DRINK_DATA.map(drink => {
                    // Count matching ingredients
                    const matchingIngredients = drink.ingredients.filter(drinkIngredient => {
                        // Get the ingredient ID from the drink ingredient object
                        // Need to handle different formats - some might be objects, some might be strings
                        const drinkIngredientId = typeof drinkIngredient === 'object'
                            ? drinkIngredient.id
                            : drinkIngredient;

                        // Check if this ingredient exists in the bar
                        return barIngredients.some(barIng => {
                            // Handle null/undefined safely with optional chaining
                            const barIngId = barIng?.id?.toLowerCase();
                            const barIngName = barIng?.name?.toLowerCase();

                            // For drink ingredient, handle possible formats
                            const drinkIngId = typeof drinkIngredientId === 'string'
                                ? drinkIngredientId.toLowerCase()
                                : '';

                            // For comparison, either IDs match or names match
                            return barIngId === drinkIngId ||
                                (drinkIngredient?.name && barIngName === drinkIngredient.name.toLowerCase());
                        });
                    });

                    // Calculate match percentage
                    const matchPercentage = Math.round(
                        (matchingIngredients.length / drink.ingredients.length) * 100
                    );

                    // Return drink with match data
                    return {
                        ...drink,
                        matchPercentage,
                        matchingIngredients,
                        missingIngredients: drink.ingredients.filter(
                            ing => !matchingIngredients.includes(ing)
                        )
                    };
                });

                // Filter drinks with > 50% match and sort by match percentage
                const filteredDrinks = matchedDrinks
                    .filter(drink => drink.matchPercentage >= 50)
                    .sort((a, b) => b.matchPercentage - a.matchPercentage);

                setRecommendations(filteredDrinks);
                console.log("Matched drinks:", filteredDrinks);
            } catch (err) {
                console.error("Error matching drinks:", err);
                setError("Failed to match drinks with your ingredients. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        // Run the matching algorithm
        matchDrinksWithIngredients();
    }, [barIngredients]);

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Finding the perfect drinks for you...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <Link to="/ingredients" className="primary-button">Back to Ingredients</Link>
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>No Matching Drinks Found</h1>
                    <p>We couldn't find any drinks with at least 50% match to your ingredients.</p>
                    <div className="add-button">
                        <Link to="/ingredients">Add More Ingredients</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Format ingredients list with separate elements for each ingredient
    const ingredientsDisplay = barIngredients.map((item, index) => (
        <React.Fragment key={index}>
            <span className="ingredient-highlight">{item.name}</span>
            {index < barIngredients.length - 1 && <span className="ingredient-separator">, </span>}
        </React.Fragment>
    ));

    return (
        <div className="recommendation-page">
            <div className="recommendation-header">
                <h1>Drinks You Can Make</h1>
                <p>Based on your bar ingredients:</p>
                <div className="ingredients-used-container">
                    <div className="ingredients-used">
                        {ingredientsDisplay}
                    </div>
                </div>
                <p>Showing drinks with at least 50% ingredient match</p>
            </div>

            <div className="recommendations-grid">
                {recommendations.map(drink => (
                    <div className="card">
                        <img
                            src={drink.image_url || `/images/drinks/${drink.id}.jpg`}
                            alt={drink.name}
                            className="card-image"
                            onError={(e) => {
                                e.target.src = '/images/drinks/default.jpg';
                            }}
                        />
                        <div className="drink-content">
                            <h2>{drink.name}</h2>
                            <p className="drink-description">{drink.description}</p>

                            <div className="drink-ingredients">
                                <h3>Ingredients:</h3>
                                <ul>
                                    {drink.ingredients.map((ingredient, idx) => {
                                        // Get ingredient name based on possible formats
                                        const ingredientName = typeof ingredient === 'object'
                                            ? (ingredient.name || ingredient.id)
                                            : ingredient;

                                        // Check if this ingredient is in the user's bar
                                        const isMatching = barIngredients.some(barIng => {
                                            if (typeof ingredient === 'object') {
                                                return barIng.id === ingredient.id ||
                                                    barIng.name === ingredient.name;
                                            } else {
                                                return barIng.id === ingredient ||
                                                    barIng.name === ingredient;
                                            }
                                        });

                                        return (
                                            <li key={idx} className={isMatching ? "matching" : "missing"}>
                                                {ingredientName} {ingredient.amount ? `(${ingredient.amount})` : ''}
                                                {isMatching ? " ✓" : ""}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="button-container">
                                <Link
                                    to={`/drinks/${drink.id}`}
                                    state={{ ingredients: barIngredients }}
                                    className="view-recipe-button"
                                >
                                    View Recipe
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationPage;