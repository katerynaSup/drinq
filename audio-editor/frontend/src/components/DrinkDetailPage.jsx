import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import IngredientSubstitution from './IngredientSubstitution';
import '../styles/DrinkDetailPage.css';
import { DRINKS_DATA } from './DrinksPage';

const DrinkDetailPage = () => {
    const { id } = useParams();
    const [drink, setDrink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Find the drink by ID in our local data
            const selectedDrink = DRINKS_DATA.find(drink => drink.id === id);

            if (selectedDrink) {
                setDrink(selectedDrink);
            } else {
                setError('Drink not found');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error finding drink:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [id]);

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
                <div className="drink-header">
                    <div className="drink-image-container">
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

                    <div className="drink-header-content">
                        <h1>{drink.name}</h1>
                        <p className="drink-description">{drink.description}</p>
                        <div className="drink-meta">
                            <span className="glass-type">Glass: {drink.glass}</span>
                        </div>
                    </div>
                </div>

                <div className="drink-content">
                    <div className="ingredients-section">
                        <h2>Ingredients</h2>
                        <ul className="ingredients-list">
                            {drink.ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    <IngredientSubstitution
                                        ingredient={ingredient.id.replace(/-/g, ' ')}
                                        amount={ingredient.amount}
                                        unit=""
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
    );
};

export default DrinkDetailPage; 