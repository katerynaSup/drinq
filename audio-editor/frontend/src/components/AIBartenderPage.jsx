import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/AIBartenderPage.css';

const AIBartenderPage = () => {
    const [barItems, setBarItems] = useState([]);
    const [userPrompt, setUserPrompt] = useState('');
    const [generatedDrinks, setGeneratedDrinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const location = useLocation();

    // Load bar items from localStorage when component mounts
    useEffect(() => {
        const savedBarItems = localStorage.getItem('barItems');
        if (savedBarItems) {
            try {
                setBarItems(JSON.parse(savedBarItems));
            } catch (error) {
                console.error('Error loading saved bar items:', error);
                setError('Failed to load your bar ingredients. Please try again.');
            }
        }

        // If ingredients were passed through navigation state, use those instead
        if (location.state?.ingredients) {
            setBarItems(location.state.ingredients);
        }
    }, [location.state]);

    const handleGenerateDrinks = async () => {
        if (barItems.length < 2) {
            setError('Please add at least 2 ingredients to your bar before generating drinks.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedDrinks([]);

        try {
            const response = await fetch('/api/ai-bartender/generate-multiple-drinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients: barItems,
                    user_prompt: userPrompt || undefined,
                    count: 3, // Generate 3 drinks by default
                    llm_config: {
                        provider: "gemini",  // Specify the provider here
                        model_name: "gemini-2.0-flash"  // Optional: specify a model
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate drinks');
            }

            const data = await response.json();
            setGeneratedDrinks(data);
            
            // Auto-open the first drink tab
            if (data.length > 0) {
                setActiveTab(data[0].id);
            }
            
        } catch (err) {
            console.error('Error generating drinks:', err);
            setError(err.message || 'Failed to generate drinks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleTab = (drinkId) => {
        setActiveTab(activeTab === drinkId ? null : drinkId);
    };

    return (
        <div className="page-container ai-bartender-page">
            <div className="page-header">
                <h1>AI Bartender</h1>
                <p>Let our AI create custom drink recipes with ingredients from your bar</p>
            </div>

            <div className="ai-bartender-container">
                <div className="bartender-input-section">
                    <div className="bar-ingredients-section">
                        <h2>Your Bar Ingredients</h2>
                        {barItems.length === 0 ? (
                            <div className="empty-bar-message">
                                <p>Your bar is empty! Add some ingredients to get started.</p>
                                <Link to="/ingredients" className="primary-button">
                                    Add Ingredients
                                </Link>
                            </div>
                        ) : (
                            <div className="ingredient-tags">
                                {barItems.map((item) => (
                                    <span key={item.id} className="ingredient-tag">
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="prompt-section">
                        <h2>Customize Your Drink</h2>
                        <textarea
                            className="prompt-input"
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            placeholder="Tell the bartender what you're in the mood for... (e.g., 'Something refreshing', 'A tropical drink', 'A strong nightcap')"
                            rows={3}
                        />
                    </div>

                    <div className="button-container">
                        <button
                            className="generate-drink-button"
                            onClick={handleGenerateDrinks}
                            disabled={loading || barItems.length < 2}
                        >
                            {loading ? 'Mixing Drinks...' : 'Generate Custom Drinks'}
                        </button>

                        {barItems.length < 2 && (
                            <p className="minimum-notice">Add at least 2 ingredients to generate drinks</p>
                        )}

                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="cocktail-loader"></div>
                        <p>Our AI bartender is mixing up something special...</p>
                    </div>
                )}

                {generatedDrinks.length > 0 && (
                    <div className="generated-drinks-section">
                        <h2>Your Custom Drinks</h2>
                        <div className="drink-tabs">
                            {generatedDrinks.map((drink) => (
                                <div key={drink.id} className="drink-tab-container">
                                    <div
                                        className={`drink-tab ${activeTab === drink.id ? 'active' : ''}`}
                                        onClick={() => toggleTab(drink.id)}
                                    >
                                        <h3>{drink.name}</h3>
                                        <p className="drink-description">{drink.description}</p>
                                        <div className={`tab-arrow ${activeTab === drink.id ? 'open' : ''}`}>
                                            {activeTab === drink.id ? '▼' : '▶'}
                                        </div>
                                    </div>
                                    
                                    {activeTab === drink.id && (
                                        <div className="drink-details">
                                            <div className="drink-ingredients">
                                                <h4>Ingredients</h4>
                                                <ul>
                                                    {drink.ingredients.map((ingredient, index) => (
                                                        <li key={index}>
                                                            <span className="ingredient-name">{ingredient.name}</span>
                                                            {ingredient.amount && (
                                                                <>
                                                                    <span className="ingredient-amount">
                                                                        {ingredient.amount}
                                                                    </span>
                                                                    {ingredient.unit && (
                                                                        <span className="ingredient-unit">
                                                                            {ingredient.unit}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="drink-instructions">
                                                <h4>Instructions</h4>
                                                <ol>
                                                    {drink.instructions.map((step, index) => (
                                                        <li key={index}>{step}</li>
                                                    ))}
                                                </ol>
                                            </div>

                                            <div className="drink-meta">
                                                <span className="glass-type">Glass: {drink.glass_type}</span>
                                                <span className="difficulty">
                                                    Difficulty: {Array(drink.difficulty || 1).fill('★').join('')}
                                                </span>
                                                <span className="prep-time">
                                                    Prep time: {drink.prep_time_minutes || 5} mins
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIBartenderPage;