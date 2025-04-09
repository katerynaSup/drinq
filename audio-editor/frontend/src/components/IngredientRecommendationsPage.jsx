import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/RecommendationPage.css';

// Mock data for now
const MOCK_DRINK_DATA = [
    {
        id: 1,
        name: 'Mojito',
        description: 'A refreshing Cuban highball with rum, mint, lime, sugar, and soda water.',
        image: '/images/drinks/mojito.jpg',
        ingredients: ['white rum', 'mint', 'lime juice', 'sugar', 'soda water'],
        matchPercentage: 100
    },
    {
        id: 2,
        name: 'Old Fashioned',
        description: 'A classic whiskey cocktail made with bourbon or rye, sugar, bitters, and a twist of citrus rind.',
        image: '/images/drinks/old-fashioned.jpg',
        ingredients: ['bourbon', 'sugar', 'angostura bitters', 'orange peel'],
        matchPercentage: 85
    },
    {
        id: 3,
        name: 'Moscow Mule',
        description: 'A spicy vodka-based cocktail with ginger beer and lime juice, traditionally served in a copper mug.',
        image: '/images/drinks/moscow-mule.jpg',
        ingredients: ['vodka', 'ginger beer', 'lime juice'],
        matchPercentage: 75
    },
    {
        id: 4,
        name: 'Margarita',
        description: 'A tangy tequila cocktail with lime juice and triple sec, often served with salt on the rim.',
        image: '/images/drinks/margarita.jpg',
        ingredients: ['tequila', 'lime juice', 'triple sec', 'salt'],
        matchPercentage: 70
    }
];

const IngredientRecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Get ingredients from navigation state
        const ingredients = location.state?.ingredients || [];

        if (ingredients.length === 0) {
            setLoading(false);
            return;
        }

        // In a real app, you would fetch recommendations from an API
        // For now, we'll use mock data and simulate a loading delay
        const fetchRecommendations = async () => {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Sort mock data by match percentage (would be calculated on server in real app)
            const results = [...MOCK_DRINK_DATA].sort((a, b) => b.matchPercentage - a.matchPercentage);

            setRecommendations(results);
            setLoading(false);
        };

        fetchRecommendations();
    }, [location.state]);

    // Show ingredients used for recommendations
    const ingredientsList = location.state?.ingredients?.map(item => item.name).join(', ') || 'No ingredients selected';

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Recommended Drinks</h1>
                <p>Based on your ingredients: <span className="ingredient-highlight">{ingredientsList}</span></p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Finding the perfect drinks for you...</p>
                </div>
            ) : recommendations.length > 0 ? (
                <div className="grid-layout">
                    {recommendations.map(drink => (
                        <div key={drink.id} className="card">
                            <div className="match-badge">{drink.matchPercentage}% Match</div>
                            <img src={drink.image} alt={drink.name} className="card-image" />
                            <div className="card-content">
                                <h2>{drink.name}</h2>
                                <p className="card-description">{drink.description}</p>
                                <div className="card-ingredients">
                                    <h3>Ingredients:</h3>
                                    <ul>
                                        {drink.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Link to={`/drinks/${drink.id}`} className="button primary-button">View Full Recipe</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <h2>No drinks found</h2>
                    <p>Try adding different ingredients to your selection.</p>
                    <Link to="/ingredients" className="button primary-button">Back to Ingredients</Link>
                </div>
            )}
        </div>
    );
};

export default IngredientRecommendationsPage; 