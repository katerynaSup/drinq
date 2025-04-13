import React, { useState } from 'react';
import '../styles/IngredientSubstitution.css';

const IngredientSubstitution = ({ ingredient, amount, unit }) => {
    const [substitutions, setSubstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSubstitutions, setShowSubstitutions] = useState(false);

    const fetchSubstitutions = async () => {
        if (loading || substitutions.length > 0) {
            setShowSubstitutions(!showSubstitutions);
            return;
        }

        setLoading(true);
        try {
            // encode the ingredient name to handle special characters
            const encodedIngredient = encodeURIComponent(ingredient.trim());
            const response = await fetch(`/api/ingredient-substitutions/${encodedIngredient}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch substitutions: ${response.status}`);
            }

            const data = await response.json();
            setSubstitutions(data.substitutions || []);
            setShowSubstitutions(true);
        } catch (error) {
            console.error('Error fetching substitutions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!ingredient) return null;

    return (
        <div className="ingredient-substitution">
            <div className="ingredient-item">
                <button
                    className="substitution-button"
                    onClick={fetchSubstitutions}
                    aria-label={`Find substitutes for ${ingredient}`}
                >
                    {showSubstitutions ? 'Hide options' : 'Need a substitute?'}
                </button>
            </div>

            {showSubstitutions && substitutions.length > 0 && (
                <div className="substitution-list">
                    <h4>Substitution options:</h4>
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
            )}

            {showSubstitutions && substitutions.length === 0 && (
                <div className="no-substitutions">
                    <p>No substitutions found for {ingredient}.</p>
                </div>
            )}

            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
};

export default IngredientSubstitution; 