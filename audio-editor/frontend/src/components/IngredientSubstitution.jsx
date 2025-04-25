import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IngredientSubstitution.css';
import substitutionsData from '../data/substitutions.json';

const IngredientSubstitution = ({ ingredient, amount, unit }) => {
    const [showSubstitutes, setShowSubstitutes] = useState(false);
    const ingredientKey = (ingredient.charAt(0).toUpperCase() + ingredient.slice(1)).replace(' ', '-');
    const substitutions = substitutionsData[ingredientKey]?.substitutions || [];

    return (
        <div className="ingredient-substitution">
            <button
                className="substitution-button"
                onClick={() => setShowSubstitutes(!showSubstitutes)}
            >
                {showSubstitutes ? 'Hide Substitutes' : 'Show Substitutes'}
            </button>

            {showSubstitutes && (
                <div className="substitutes-section">
                    <h3>Substitutes for {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</h3>
                    {substitutions.map((sub, index) => (
                        <div key={index} className="sub-item">
                            <div className="sub-header">
                                <span>{sub.substitute}</span>
                                <span style={{
                                    backgroundColor: sub.authenticity >= 80 ? 'rgba(206, 165, 241, 0.56)' :
                                        sub.authenticity >= 60 ? 'rgba(255, 152, 0, 0.56)' : 'rgba(244, 67, 54, 0.62)'
                                }}>
                                    {sub.authenticity}% match
                                </span>
                            </div>
                            <p>{sub.notes}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IngredientSubstitution; 