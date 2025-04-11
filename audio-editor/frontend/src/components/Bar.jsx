import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Bar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMartiniGlassCitrus, faGlassWater } from '@fortawesome/free-solid-svg-icons';

const Bar = ({ barItems, onRemoveItem, isOpen, onClose, onGenerateDrinks }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const totalItems = barItems.length;

    const handleFindDrinks = () => {
        // Close the bar
        onClose();

        // Navigate to main recommendations page with bar items as ingredients
        navigate('/recommendationPage', {
            state: { ingredients: barItems }
        });

        console.log("Navigating to recommendations with ingredients:", barItems);
    };

    console.log("Bar is open, items:", barItems); // Debug output

    return (
        <div className="bar-overlay" onClick={(e) => {
            // Close when clicking overlay but not bar itself
            if (e.target.className === 'bar-overlay') {
                onClose();
            }
        }}>
            <div className="bar-panel">
                <div className="bar-header">
                    <h2>Your Bar ({totalItems})</h2>
                    <button className="close-bar-button" onClick={onClose}>×</button>
                </div>

                {totalItems === 0 ? (
                    <div className="empty-bar">
                        <FontAwesomeIcon icon={faGlassWater} className="empty-bar-icon" />
                        <p>Your bar is empty</p>
                        <p className="empty-bar-subtext">Add some ingredients to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="bar-items-container">
                            <ul className="bar-items-list">
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
                                            className="remove-item-button"
                                            onClick={() => onRemoveItem(item.id)}
                                            title="Remove from bar"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bar-footer">
                            <button
                                className="make-drink-button"
                                onClick={handleFindDrinks}
                            >
                                <FontAwesomeIcon icon={faMartiniGlassCitrus} className="make-drink-icon" />
                                Make Drinks With These
                            </button>

                            <button
                                className="generate-custom-button"
                                onClick={onGenerateDrinks}
                                disabled={totalItems < 2}
                            >
                                Generate Custom Drink
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