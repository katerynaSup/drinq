import React from 'react';
import '../styles/IngredientCard.css';
import defaultImage from '../../public/images/logo.png';

const IngredientCard = ({ ingredient, onAddToBar, isInBar }) => {
    return (
        <div className="ingredient-card">
            <div className="ingredient-image-container">
                <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="ingredient-image"
                    onError={(e) => {
                        console.warn(`Failed to load image for ${ingredient.name}`);
                        e.target.src = defaultImage; // Fallback image
                    }}
                />
            </div>
            <div className="ingredient-content">
                <h3 className="ingredient-name">{ingredient.name}</h3>
                <p className="ingredient-description">{ingredient.description}</p>
                <div className="ingredient-meta">
                    <span className="ingredient-type">{ingredient.type}</span>
                    <span className="ingredient-alcohol">
                        {ingredient.alcohol_content ? `${ingredient.alcohol_content}%` : 'Non-alcoholic'}
                    </span>
                </div>
                <button
                    className={`add-button ${isInBar ? 'in-bar' : ''}`}
                    onClick={() => onAddToBar(ingredient)}
                    disabled={isInBar}
                >
                    {isInBar ? 'In Your Bar' : 'Add to Bar'}
                </button>
            </div>
        </div>
    );
};

export default IngredientCard; 