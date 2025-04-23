import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/MyBarPage.css';

const MyBarPage = ({ barItems, onRemoveFromBar }) => {
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (ingredientId) => {
        console.log(`Failed to load image for ingredient: ${ingredientId}`);
        setImageErrors(prev => ({
            ...prev,
            [ingredientId]: true
        }));
    };

    const renderShelf = (startIndex) => {
        return barItems.slice(startIndex, startIndex + 5).map((ingredient, index) => (
            <div key={startIndex + index} className="bottle-container">
                <div className="delete-button" onClick={() => onRemoveFromBar(ingredient.id)}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
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
        ));
    };

    return (
        <div className="bar-page-container">
            <div className="bar-background">
                <h1 className="bar-title">My Bar</h1>

                <div className="shelves-container">
                    <div className="bar-shelf-container top-shelf">
                        {renderShelf(0)}
                    </div>
                    <div className="bar-shelf-container middle-shelf">
                        {renderShelf(5)}
                    </div>
                    <div className="bar-shelf-container bottom-shelf">
                        {renderShelf(10)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyBarPage; 