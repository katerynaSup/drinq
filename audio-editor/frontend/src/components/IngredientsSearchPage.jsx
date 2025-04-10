import React, { useState, useEffect } from 'react';
import IngredientCard from './IngredientCard';
import Bar from './Bar';
import '../styles/IngredientsSearchPage.css';
import vodkaImage from '../assets/images/ingredients/vodka.png';
import rumImage from '../assets/images/ingredients/rum.png';
import ginImage from '../assets/images/ingredients/gin.png';
import tequilaImage from '../assets/images/ingredients/tequila.png';
import orangeJuiceImage from '../assets/images/ingredients/orange-juice.png';
import limeJuiceImage from '../assets/images/ingredients/lime.png';
import simpleSyrupImage from '../assets/images/ingredients/simple-syrup.png';
import grenadineImage from '../assets/images/ingredients/grenadine.png';
import mintImage from '../assets/images/ingredients/mint.png';
import clubSodaImage from '../assets/images/ingredients/club-soda.png';
import tonicWaterImage from '../assets/images/ingredients/tonic-water.png';
import colaImage from '../assets/images/ingredients/cola.png';
import gingerBeerImage from '../assets/images/ingredients/ginger-beer.png';
import cranberryJuiceImage from '../assets/images/ingredients/cranberry.png';
import pineappleJuiceImage from '../assets/images/ingredients/pineapple.png';
import coconutCreamImage from '../assets/images/ingredients/coconut.png';


// mock data with fixed image paths
const MOCK_INGREDIENTS = [
    {
        id: 'vodka',
        name: 'Vodka',
        description: 'A clear distilled alcoholic beverage that originated in Eastern Europe.',
        type: 'Spirit',
        alcohol_content: 40,
        image: vodkaImage
    },
    {
        id: 'rum',
        name: 'Rum',
        description: 'A distilled alcoholic drink made by fermenting and then distilling sugarcane.',
        type: 'Spirit',
        alcohol_content: 40,
        image: rumImage
    },
    {
        id: 'gin',
        name: 'Gin',
        description: 'A distilled alcoholic drink that derives its flavor from juniper berries.',
        type: 'Spirit',
        alcohol_content: 40,
        image: ginImage
    },
    {
        id: 'tequila',
        name: 'Tequila',
        description: 'A distilled beverage made from the blue agave plant in Mexico.',
        type: 'Spirit',
        alcohol_content: 40,
        image: tequilaImage
    },
    {
        id: 'orange-juice',
        name: 'Orange Juice',
        description: 'Fresh squeezed juice from oranges, adds a bright citrus flavor.',
        type: 'Juice',
        alcohol_content: 0,
        image: orangeJuiceImage
    },
    {
        id: 'lime-juice',
        name: 'Lime Juice',
        description: 'Tart citrus juice that adds brightness to cocktails.',
        type: 'Juice',
        alcohol_content: 0,
        image: limeJuiceImage
    },
    {
        id: 'simple-syrup',
        name: 'Simple Syrup',
        description: 'Equal parts sugar and water, used to sweeten cocktails.',
        type: 'Syrup',
        alcohol_content: 0,
        image: simpleSyrupImage
    },
    {
        id: 'grenadine',
        name: 'Grenadine',
        description: 'Sweet, tart syrup made from pomegranate juice.',
        type: 'Syrup',
        alcohol_content: 0,
        image: grenadineImage
    },
    {
        id: 'mint',
        name: 'Fresh Mint',
        description: 'Aromatic herb used in many cocktails like Mojitos.',
        type: 'Herb',
        alcohol_content: 0,
        image: mintImage
    },
    {
        id: 'club-soda',
        name: 'Club Soda',
        description: 'Carbonated water used to add fizz to cocktails.',
        type: 'Mixer',
        alcohol_content: 0,
        image: clubSodaImage
    },
    {
        id: 'tonic-water',
        name: 'Tonic Water',
        description: 'Carbonated soft drink with quinine, often paired with gin.',
        type: 'Mixer',
        alcohol_content: 0,
        image: tonicWaterImage
    },
    {
        id: 'cola',
        name: 'Cola',
        description: 'Sweet, dark soda that pairs well with rum and whiskey.',
        type: 'Mixer',
        alcohol_content: 0,
        image: colaImage
    },
    {
        id: 'ginger-beer',
        name: 'Ginger Beer',
        description: 'Spicy, non-alcoholic soda made from ginger root.',
        type: 'Mixer',
        alcohol_content: 0,
        image: gingerBeerImage
    },
    {
        id: 'cranberry-juice',
        name: 'Cranberry Juice',
        description: 'Tart juice made from cranberries, great in vodka-based drinks.',
        type: 'Juice',
        alcohol_content: 0,
        image: cranberryJuiceImage
    },
    {
        id: 'pineapple-juice',
        name: 'Pineapple Juice',
        description: 'Tropical fruit juice with a sweet and tart flavor.',
        type: 'Juice',
        alcohol_content: 0,
        image: pineappleJuiceImage
    },
    {
        id: 'coconut-cream',
        name: 'Coconut Cream',
        description: 'Rich, sweet cream made from coconut, used in tropical cocktails.',
        type: 'Dairy Substitute',
        alcohol_content: 0,
        image: coconutCreamImage
    }
];

const IngredientsSearchPage = ({ 
    barItems, 
    setBarItems, 
    isBarOpen, 
    setIsBarOpen,
    onGenerateDrinks 
}) => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // Load ingredients (mock data for now)
    useEffect(() => {
        setIngredients(MOCK_INGREDIENTS);
        setFilteredIngredients(MOCK_INGREDIENTS);
    }, []);

    // Load bar from localStorage on initial render if barItems is empty
    useEffect(() => {
        if (barItems.length === 0) {
            const savedBar = localStorage.getItem('ingredientBar');
            if (savedBar) {
                setBarItems(JSON.parse(savedBar));
            }
        }
    }, []);

    // Save bar to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('ingredientBar', JSON.stringify(barItems));
    }, [barItems]);

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

    const handleAddToBar = (ingredient) => {
        // Check if already in bar by ID
        if (!barItems.some(item => item.id === ingredient.id)) {
            const newBarItems = [...barItems, ingredient];
            setBarItems(newBarItems);
        } else {
            // Provide feedback that item is already in bar
            alert(`${ingredient.name} is already in your bar`);
        }
    };

    const handleRemoveFromBar = (ingredientId) => {
        setBarItems(barItems.filter(item => item.id !== ingredientId));
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Ingredient Search</h1>
                <p>Find ingredients to make your perfect drink</p>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="filter-tabs">
                <button
                    className={`button ${activeFilter === 'all' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All
                </button>
                <button
                    className={`button ${activeFilter === 'spirit' ? 'primary-button' : 'secondary-button'} button-border`}
                    onClick={() => setActiveFilter('spirit')}
                >
                    Spirits
                </button>
                <button
                    className={`button ${activeFilter === 'juice' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('juice')}
                >
                    Juices
                </button>
                <button
                    className={`button ${activeFilter === 'syrup' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('syrup')}
                >
                    Syrups
                </button>
                <button
                    className={`button ${activeFilter === 'herb' ? 'primary-button' : 'secondary-button'}`}
                    onClick={() => setActiveFilter('herb')}
                >
                    Herbs
                </button>
            </div>

            <div className="grid-layout">
                {filteredIngredients.length > 0 ? (
                    filteredIngredients.map(ingredient => (
                        <div key={ingredient.id} className="card">
                            < img
                                src={ingredient.image}
                                alt={ingredient.name}
                                className="card-image"
                                onError={(e) => {
                                    console.error(`Failed to load image for ${ingredient.name}:`, ingredient.image);
                                    e.target.src = '/images/ingredients/default.jpg'; // Fallback image
                                }}
                            />
                            <div className="card-content">
                                <h2 className="body-text">{ingredient.name}</h2>
                                <p className="ingredient-type">{ingredient.type}</p>
                                <button
                                    onClick={() => handleAddToBar(ingredient)}
                                    className="button primary-button"
                                    disabled={barItems.some(item => item.id === ingredient.id)}
                                >
                                    {barItems.some(item => item.id === ingredient.id) ? 'Added' : 'Add to Bar'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No ingredients found matching your search.</p>
                    </div>
                )}
            </div>

            <Bar
                barItems={barItems}
                onRemoveItem={handleRemoveFromBar}
                isOpen={isBarOpen}
                onClose={() => setIsBarOpen(false)}
                onGenerateDrinks={onGenerateDrinks}
            />
        </div>
    );
};

export default IngredientsSearchPage; 