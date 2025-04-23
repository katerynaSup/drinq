import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import IngredientSubstitution from './IngredientSubstitution';
import '../styles/DrinkDetailPage.css';
import { DRINKS_DATA } from './DrinksPage';

const DrinkDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [drink, setDrink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [matchPercentage, setMatchPercentage] = useState(null);

    // Get bar ingredients from location state (if available)
    const barIngredients = location.state?.ingredients || [];

    useEffect(() => {
        try {
            // Find the drink by ID in our local data
            const selectedDrink = DRINKS_DATA.find(drink => drink.id === id);

            if (selectedDrink) {
                setDrink(selectedDrink);

                // Calculate match percentage if bar ingredients are available
                if (barIngredients.length > 0) {
                    const matchingIngredients = selectedDrink.ingredients.filter(drinkIngredient => {
                        // Get the ingredient ID from the drink ingredient object
                        const drinkIngredientId = typeof drinkIngredient === 'object'
                            ? drinkIngredient.id
                            : drinkIngredient;

                        // Check if this ingredient exists in the bar
                        return barIngredients.some(barIng => {
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
                    const percentage = Math.round(
                        (matchingIngredients.length / selectedDrink.ingredients.length) * 100
                    );

                    setMatchPercentage(percentage);
                }
            } else {
                setError('Drink not found');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error finding drink:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [id, barIngredients]);

    if (loading) {
        return <div className="loading-container">Loading drink details...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    if (!drink) {
        return <div className="not-found-container">Drink not found</div>;
    }

    return (
        <div className="page-container">
            <Link to="/drinks" className="back-link">
                ← Back to all drinks
            </Link>

            <div className="drink-detail-container">
                <h1 className="drink-title">{drink.name}</h1>

                <div className="centered-image-container">
                    <img
                        src={drink.image_url || `/images/drinks/${drink.id}.jpg`}
                        alt={drink.name}
                        className="drink-detail-image"
                        onError={(e) => {
                            console.warn(`Failed to load image for ${drink.name}`);
                            e.target.src = '/images/drinks/default.jpg';
                        }}
                    />
                </div>
                <div className="drink-meta">
                    <div className="meta-pair">
                        <span className="glass-type">Glass: {drink.glass}</span>
                        <span className="glass-type">Alcohol: {drink.alcohol_content || 'Medium'}</span>
                    </div>

                    {matchPercentage !== null && (
                        <span className="match-percentage">
                            {matchPercentage}% Match with Your Bar
                        </span>
                    )}
                </div>

                <div className="drink-content">
                    <div className="drink-description">
                        {drink.description}
                    </div>

                    <div className="drink-sections-container">
                        <div className="ingredients-section">
                            <h2>Ingredients</h2>
                            <ul className="ingredients-list">
                                {drink.ingredients.map((ingredient, index) => (
                                    <li key={index} className="ingredient-item">
                                        <div className="ingredient-details">
                                            <div className="ingredient-name">
                                                {ingredient.id.replace(/-/g, ' ')}
                                            </div>
                                            {ingredient.amount && (
                                                <div className="ingredient-amount">
                                                    {ingredient.amount}
                                                </div>
                                            )}
                                        </div>
                                        <IngredientSubstitution
                                            ingredient={ingredient.id.replace(/-/g, ' ')}
                                            amount={ingredient.amount}
                                            unit={ingredient.unit || ""}
                                            name={ingredient.id.replace(/-/g, ' ')}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="method-section">
                            <h2>Method</h2>
                            <p>{drink.method}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrinkDetailPage; 