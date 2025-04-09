import React, { useState, useEffect } from 'react';
import IngredientCard from './IngredientCard';
import ShoppingCart from './ShoppingCart';
import '../styles/IngredientsSearchPage.css';

// mock data
const MOCK_INGREDIENTS = [
    {
        id: 'vodka',
        name: 'Vodka',
        description: 'A clear distilled alcoholic beverage that originated in Eastern Europe.',
        type: 'Spirit',
        alcohol_content: 40,
        image_url: '../../images/ingredients/vodka.png'
    },
    {
        id: 'rum',
        name: 'Rum',
        description: 'A distilled alcoholic drink made by fermenting and then distilling sugarcane.',
        type: 'Spirit',
        alcohol_content: 40,
        image_url: '../../images/ingredients/rum.png'
    },
    {
        id: 'gin',
        name: 'Gin',
        description: 'A distilled alcoholic drink that derives its flavor from juniper berries.',
        type: 'Spirit',
        alcohol_content: 40,
        image_url: '../../images/ingredients/gin.png'
    },
    {
        id: 'tequila',
        name: 'Tequila',
        description: 'A distilled beverage made from the blue agave plant in Mexico.',
        type: 'Spirit',
        alcohol_content: 40,
        image_url: '../../images/ingredients/tequila.png'
    },
    {
        id: 'orange-juice',
        name: 'Orange Juice',
        description: 'Fresh squeezed juice from oranges, adds a bright citrus flavor.',
        type: 'Juice',
        alcohol_content: 0,
        image_url: '../../images/ingredients/orange-juice.png'
    },
    {
        id: 'lime-juice',
        name: 'Lime Juice',
        description: 'Tart citrus juice that adds brightness to cocktails.',
        type: 'Juice',
        alcohol_content: 0,
        image_url: '../../images/ingredients/lime-juice.npg'
    },
    {
        id: 'simple-syrup',
        name: 'Simple Syrup',
        description: 'Equal parts sugar and water, used to sweeten cocktails.',
        type: 'Syrup',
        alcohol_content: 0,
        image_url: '../../images/ingredients/simple-syrup.png'
    },
    {
        id: 'grenadine',
        name: 'Grenadine',
        description: 'Sweet, tart syrup made from pomegranate juice.',
        type: 'Syrup',
        alcohol_content: 0,
        image_url: '../../images/ingredients/grenadine.png'
    },
    {
        id: 'bitters',
        name: 'Angostura Bitters',
        description: 'Concentrated botanical infusion that adds complexity.',
        type: 'Bitters',
        alcohol_content: 44,
        image_url: '../../images/ingredients/bitters.png'
    },
    {
        id: 'mint',
        name: 'Fresh Mint',
        description: 'Aromatic herb used in many cocktails like Mojitos.',
        type: 'Herb',
        alcohol_content: 0,
        image_url: '../../images/ingredients/mint.png'
    }
];

const IngredientsSearchPage = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    // load ingredients (mock data for now)
    useEffect(() => {
        // Using mock data
        setIngredients(MOCK_INGREDIENTS);
        setFilteredIngredients(MOCK_INGREDIENTS);
    }, []);

    // search and filtering
    useEffect(() => {
        let results = ingredients;

        // type filter
        if (activeFilter !== 'all') {
            results = results.filter(ing => ing.type.toLowerCase() === activeFilter.toLowerCase());
        }

        //  search term
        if (searchTerm) {
            results = results.filter(ing =>
                ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ing.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredIngredients(results);
    }, [searchTerm, ingredients, activeFilter]);

    const handleAddToCart = (ingredient) => {
        //  if already in cart
        if (!cartItems.some(item => item.id === ingredient.id)) {
            setCartItems([...cartItems, ingredient]);
        }
    };

    const handleRemoveFromCart = (ingredientId) => {
        setCartItems(cartItems.filter(item => item.id !== ingredientId));
    };

    return (
        <div className="ingredients-search-page">
            <div className="search-header">
                <h1>Ingredient Search</h1>
                <p>Find ingredients to make your perfect drink</p>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'spirit' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('spirit')}
                    >
                        Spirits
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'juice' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('juice')}
                    >
                        Juices
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'syrup' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('syrup')}
                    >
                        Syrups
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'herb' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('herb')}
                    >
                        Herbs
                    </button>
                </div>
            </div>

            <div className="cart-status" onClick={() => setIsCartOpen(true)}>
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{cartItems.length}</span>
            </div>

            <div className="ingredients-grid">
                {filteredIngredients.length > 0 ? (
                    filteredIngredients.map(ingredient => (
                        <IngredientCard
                            key={ingredient.id}
                            ingredient={ingredient}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No ingredients found.</p>
                        <p>Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>

            <ShoppingCart
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
};

export default IngredientsSearchPage; 