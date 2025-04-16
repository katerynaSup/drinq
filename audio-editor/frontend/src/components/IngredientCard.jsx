import React from 'react';
import '../styles/IngredientCard.css';
import defaultImage from '../../public/images/logo.png';

const IngredientCard = ({ ingredient, onAddToBar, onRemoveFromBar, isInBar }) => {
    const handleRemove = () => {
        if (typeof onRemoveFromBar === 'function') {
            onRemoveFromBar(ingredient.id);
        }
    };

    return (
        <div className="ingredient-card">
            <div className="ingredient-image-container">
                <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="ingredient-image"
                    onError={(e) => {
                        console.warn(`Failed to load image for ${ingredient.name}`);
                        e.target.src = defaultImage;
                    }}
                />
            </div>
            <div className="ingredient-content">
                <h3>{ingredient.name}</h3>
                <p className="ingredient-description">{ingredient.description}</p>
                <div className="ingredient-meta">
                    <span className="ingredient-type">{ingredient.type}</span>
                    <span className="ingredient-alcohol">
                        {ingredient.alcohol_content ? `${ingredient.alcohol_content}%` : 'Non-alcoholic'}
                    </span>
                </div>
                {!isInBar ? (
                    <button
                        className="add-button"
                        onClick={() => onAddToBar(ingredient)}
                    >
                        Add to Bar
                    </button>
                ) : (
                    <button
                        className="remove-button red-button"
                        onClick={handleRemove}
                    >
                        Remove from Bar
                    </button>
                )}
            </div>
        </div>
    );
};

export default IngredientCard;
