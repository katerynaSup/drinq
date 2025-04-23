import React, { useState } from 'react';
import '../styles/MyBarPage.css';

const MyBarPage = ({ barItems }) => {
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (ingredientId) => {
        console.log(`Failed to load image for ingredient: ${ingredientId}`);
        setImageErrors(prev => ({
            ...prev,
            [ingredientId]: true
        }));
    };

    return (
        <div className="bar-page-container">
            <div className="bar-background">
                <h1 className="bar-title">My Bar</h1>

                <div className="bar-shelf-container">
                    {barItems.map((ingredient, index) => (
                        <div key={index} className="bottle-container">
                            <div className="bottle-image-wrapper">
                                <img
                                    src={ingredient.image_url || `/images/ingredients/${ingredient.id.toLowerCase()}.png`}
                                    alt={ingredient.name}
                                    className="bottle-image"
                                    onError={() => handleImageError(ingredient.id)}
                                />
                                <div className="bottle-glow"></div>
                            </div>
                            <span className="ingredient-label">
                                {ingredient.name || ingredient.id.replace(/-/g, ' ')}
                            </span>
                            {imageErrors[ingredient.id] && (
                                <span className="image-error">
                                    {ingredient.name || ingredient.id.replace(/-/g, ' ')}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyBarPage; 