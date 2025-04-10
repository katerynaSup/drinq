import React from 'react';
import IngredientSubstitution from './IngredientSubstitution';


const DrinkCard = ({ drink }) => {
    return (
        <div className="drink-card">
            {drink.image_url && <img src={drink.image_url} alt={drink.name} />}
            <h2>{drink.name}</h2>
            <p>{drink.description}</p>

            <div className="drink-details">
                <div className="drink-ingredients">
                    <h3>Ingredients</h3>
                    <ul>
                        {drink.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                <IngredientSubstitution
                                    ingredient={ingredient.name}
                                    amount={ingredient.amount}
                                    unit={ingredient.unit}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="drink-instructions">
                    <h3>Instructions</h3>
                    <ol>
                        {drink.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

                <div className="drink-info">
                    <span className="drink-glass">Glass: {drink.glass_type}</span>
                    <span className="drink-prep-time">Prep time: {drink.prep_time_minutes} mins</span>
                    <span className="drink-difficulty">Difficulty: {Array(drink.difficulty).fill('★').join('')}</span>
                </div>
            </div>
        </div>
    );
};

export default DrinkCard;
