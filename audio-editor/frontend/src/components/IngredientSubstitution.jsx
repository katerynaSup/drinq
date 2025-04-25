import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IngredientSubstitution.css';
import substitutionsData from '../data/substitutions.json';

const IngredientSubstitution = ({ ingredient, amount, unit }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowSubstitutions = () => {
        setShowModal(true);
    };

    // Get substitutions for this ingredient
    const ingredientKey = ingredient.toLowerCase().replace(' ', '-');
    const substitutions = substitutionsData[ingredientKey]?.substitutions || [];

    return (
        <div className="ingredient-substitution">
            <button
                className="substitution-button"
                onClick={handleShowSubstitutions}
                aria-label={`Find substitutes for ${ingredient}`}
            >
                Find Substitutes
            </button>

            {showModal && (
                <div className="fullscreen-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Showing substitutes for {ingredient}</h2>
                            <button
                                className="close-modal-button"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            {substitutions.length > 0 ? (
                                <div className="substitution-list">
                                    {substitutions.map((sub, index) => (
                                        <div key={index} className="substitution-item">
                                            <div className="substitution-header">
                                                <span className="substitute-name">{sub.substitute}</span>
                                                <span className="authenticity-badge"
                                                    style={{
                                                        backgroundColor: sub.authenticity >= 80 ? '#4caf50' :
                                                            sub.authenticity >= 60 ? '#ff9800' : '#f44336'
                                                    }}>
                                                    {sub.authenticity}% match
                                                </span>
                                            </div>
                                            <p className="substitution-notes">{sub.notes}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-substitutions">
                                    <p>No substitutions found for {ingredient}.</p>
                                    <p>Try our AI Bartender to create custom drinks with your available ingredients!</p>
                                    <Link to="/ai-bartender" className="ai-bartender-link">
                                        Go to AI Bartender
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientSubstitution; 