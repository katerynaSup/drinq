import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IngredientSubstitution.css';

const IngredientSubstitution = ({ ingredient, amount, unit }) => {
    const [substitutions, setSubstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchSubstitutions = async () => {
        setLoading(true);
        try {
            const encodedIngredient = encodeURIComponent(ingredient.trim());
            const response = await fetch(`/api/ingredient-substitutions/${encodedIngredient}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch substitutions: ${response.status}`);
            }

            const data = await response.json();
            setSubstitutions(data.substitutions || []);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching substitutions:', error);
            setSubstitutions([]);
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ingredient-substitution">
            <button
                className="substitution-button"
                onClick={fetchSubstitutions}
                aria-label={`Find substitutes for ${ingredient}`}
            >
                Find Substitutes
            </button>

            {showModal && (
                <div className="substitution-modal-overlay">
                    <div className="substitution-modal">
                        <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
                        <h3>Substitutes for {ingredient}</h3>

                        {loading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : substitutions.length > 0 ? (
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
            )}
        </div>
    );
};

export default IngredientSubstitution; 