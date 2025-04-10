import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Bar.css';

const Bar = ({ barItems, onRemoveItem, isOpen, onClose, onGenerateDrinks }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const totalItems = barItems.length;

    const handleFindDrinks = () => {
        // Close the bar

        onClose();

        // Navigate to recommendations page with cart items as state
        navigate('/ingredient-recommendations', {
            state: { ingredients: barItems }
        });
    };

    console.log("Bar is open, items:", barItems); // Debug output

    return (
        <div className="bar-overlay" onClick={(e) => {
            // Close when clicking overlay but not bar itself
            if (e.target.className === 'bar-overlay') {
                onClose();
            }
        }}>
            <div className="bar">
                <div className="bar-header">
                    <h2>Your Bar ({totalItems})</h2>
                    <button className="close-bar-button" onClick={onClose}>×</button>
                </div>

                {totalItems === 0 ? (
                    <div className="empty-bar">
                        <p>Your bar is empty</p>
                        <p className="empty-bar-subtext">Add some ingredients to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="bar-items">
                            <ul className="bar-items">
                                {barItems.map(item => (
                                    <li key={item.id} className="bar-item">
                                        <div className="bar-item-info">
                                            <img
                                                src={item.image || '/images/ingredients/default.jpg'}
                                                alt={item.name}
                                                className="bar-item-image"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    e.target.src = '/images/ingredients/default.jpg';
                                                    console.log("Image failed to load:", item.image_url);
                                                }}
                                            />
                                            <div className="bar-item-details">
                                                <h3>{item.name}</h3>
                                                <span className="bar-item-type">{item.type}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="remove-item"
                                            onClick={() => onRemoveItem(item.id)}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bar-footer">
                            <div className="bar-summary">
                                <span>Total Items: {totalItems}</span>
                            </div>
                            <button
                                className="find-drinks-button"
                                onClick={handleFindDrinks}
                            >
                                Find Drinks With These
                            </button>
                            <button
                                className="generate-drinks-button"
                                onClick={onGenerateDrinks}
                                disabled={totalItems < 2}
                            >
                                Generate Drinks
                            </button>
                            {totalItems < 2 && (
                                <p className="minimum-notice">Add at least 2 ingredients to generate drinks</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Bar; 