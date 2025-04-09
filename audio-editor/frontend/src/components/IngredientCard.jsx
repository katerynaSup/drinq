import React from 'react';
import '../styles/IngredientCard.css';

const IngredientCard = ({ ingredient, onAddToCart }) => {
  return (
    <div className="ingredient-card">
      <div className="ingredient-image-container">
        <img 
          src={ingredient.image_url || '/images/ingredients/default.jpg'} 
          alt={ingredient.name} 
          className="ingredient-image"
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
          className="add-to-cart-button"
          onClick={() => onAddToCart(ingredient)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default IngredientCard; 