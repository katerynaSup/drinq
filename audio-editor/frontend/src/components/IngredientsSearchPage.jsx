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
import lemonJuiceImage from '../assets/images/ingredients/lemon-juice.png';
import agaveSyrupImage from '../assets/images/ingredients/agave-syrup.png';
import honeySyrupImage from '../assets/images/ingredients/honey.png';
import basilImage from '../assets/images/ingredients/basil.png';
import cucumberImage from '../assets/images/ingredients/cucumber.png';
import blackberryImage from '../assets/images/ingredients/blackberry.png';
import peachPureeImage from '../assets/images/ingredients/peach.png';
import eggWhiteImage from '../assets/images/ingredients/egg.png';
import maraschinoCherryImage from '../assets/images/ingredients/maraschino-cherry.png';
import oliveImage from '../assets/images/ingredients/olives.png';
import lycheeSyrupImage from '../assets/images/ingredients/lychee-syrup.png';
import passionFruitPureeImage from '../assets/images/ingredients/passion-fruit.png';
import jalapenoSliceImage from '../assets/images/ingredients/jalapeno-slices.png';
import gingerSyrupImage from '../assets/images/ingredients/ginger-syrup.png';
import tamarindPasteImage from '../assets/images/ingredients/tamarind.png';
import chiliPowderImage from '../assets/images/ingredients/chili-powder.png';
import blueCuracaoImage from '../assets/images/ingredients/blue-curacao.png';
import roseWaterImage from '../assets/images/ingredients/rose-water.png';
import lavenderSyrupImage from '../assets/images/ingredients/lavender-syrup.png';
import matchaPowderImage from '../assets/images/ingredients/matcha-powder.png';
import greenTeaImage from '../assets/images/ingredients/green-tea.png';
import sojuImage from '../assets/images/ingredients/soju.png';
import bacardiImage from '../assets/images/ingredients/bacardi.png';
import coconutSyrupImage from '../assets/images/ingredients/coconut.png';
import coconutRumImage from '../assets/images/ingredients/coconut-rum.png';
import aperolImage from '../assets/images/ingredients/aperol.png';
import cinnamonSyrupImage from '../assets/images/ingredients/cinnamon.png';
import sourMixImage from '../assets/images/ingredients/sour-mix.png';
import orangeBittersImage from '../assets/images/ingredients/orange-bitters.png';
import sparklingWaterImage from '../assets/images/ingredients/sparkling-water.png';
import cherryLiqueurImage from '../assets/images/ingredients/cherry-liqueur.jpg';
import strawberryImage from '../assets/images/ingredients/strawberry.png';
import strawberryPureeImage from '../assets/images/ingredients/strawberry-puree.png';
import strawberrySyrupImage from '../assets/images/ingredients/strawberry-syrup.png';
import strawberryVodkaImage from '../assets/images/ingredients/strawberry-vodka.png';
import vanillaVodkaImage from '../assets/images/ingredients/vanilla-vodka.png';
import citrusVodkaImage from '../assets/images/ingredients/citrus-vodka.png';
import pepperVodkaImage from '../assets/images/ingredients/pepper-vodka.png';
import blueberryVodkaImage from '../assets/images/ingredients/blueberry-vodka.png';
import rosemaryImage from '../assets/images/ingredients/rosemary.png';
import thymeImage from '../assets/images/ingredients/thyme.png';
import cinnamonStickImage from '../assets/images/ingredients/cinnamon.png';
import starAniseImage from '../assets/images/ingredients/star-anise.png';


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
    },
    {
        id: 'lemon-juice',
        name: 'Lemon Juice',
        description: 'Tart citrus juice that adds brightness and acidity to cocktails.',
        type: 'Juice',
        alcohol_content: 0,
        image: lemonJuiceImage
    },
    {
        id: 'agave-syrup',
        name: 'Agave Syrup',
        description: 'A natural sweetener derived from agave plants, often used in tequila cocktails.',
        type: 'Syrup',
        alcohol_content: 0,
        image: agaveSyrupImage
    },
    {
        id: 'honey-syrup',
        name: 'Honey Syrup',
        description: 'A mixture of honey and water, used to add smooth sweetness.',
        type: 'Syrup',
        alcohol_content: 0,
        image: honeySyrupImage
    },
    {
        id: 'basil',
        name: 'Fresh Basil',
        description: 'A fragrant herb that adds a unique twist to refreshing cocktails.',
        type: 'Herb',
        alcohol_content: 0,
        image: basilImage
    },
    {
        id: 'cucumber',
        name: 'Cucumber',
        description: 'Adds a refreshing, cooling element to drinks, often muddled.',
        type: 'Vegetable',
        alcohol_content: 0,
        image: cucumberImage
    },
    {
        id: 'blackberry',
        name: 'Blackberries',
        description: 'Juicy and tart berries that add color and flavor.',
        type: 'Fruit',
        alcohol_content: 0,
        image: blackberryImage
    },
    {
        id: 'peach-puree',
        name: 'Peach Puree',
        description: 'Smooth and sweet fruit puree used in Bellinis and other fruity drinks.',
        type: 'Puree',
        alcohol_content: 0,
        image: peachPureeImage
    },
    {
        id: 'egg-white',
        name: 'Egg White',
        description: 'Used to create a frothy, creamy texture in shaken cocktails.',
        type: 'Additive',
        alcohol_content: 0,
        image: eggWhiteImage
    },
    {
        id: 'maraschino-cherry',
        name: 'Maraschino Cherry',
        description: 'A sweet, preserved cherry often used as a garnish.',
        type: 'Garnish',
        alcohol_content: 0,
        image: maraschinoCherryImage
    },
    {
        id: 'olive',
        name: 'Olive',
        description: 'Classic savory garnish, especially in martinis.',
        type: 'Garnish',
        alcohol_content: 0,
        image: oliveImage
    },
    {
        id: 'lychee-syrup',
        name: 'Lychee Syrup',
        description: 'Sweet, floral syrup made from lychee fruit, great for tropical drinks.',
        type: 'Syrup',
        alcohol_content: 0,
        image: lycheeSyrupImage
    },
    {
        id: 'passion-fruit-puree',
        name: 'Passion Fruit Puree',
        description: 'Tart and tangy fruit puree with a tropical punch.',
        type: 'Puree',
        alcohol_content: 0,
        image: passionFruitPureeImage
    },
    {
        id: 'jalapeno-slice',
        name: 'Jalapeño Slice',
        description: 'Spicy pepper slice used to add heat and kick to cocktails.',
        type: 'Spice',
        alcohol_content: 0,
        image: jalapenoSliceImage
    },
    {
        id: 'ginger-syrup',
        name: 'Ginger Syrup',
        description: 'Sweet and spicy syrup made from fresh ginger root.',
        type: 'Syrup',
        alcohol_content: 0,
        image: gingerSyrupImage
    },
    {
        id: 'tamarind-paste',
        name: 'Tamarind Paste',
        description: 'Tart and tangy paste used in exotic and tropical drinks.',
        type: 'Paste',
        alcohol_content: 0,
        image: tamarindPasteImage
    },
    {
        id: 'chili-powder',
        name: 'Chili Powder',
        description: 'Spicy and smoky powder used to rim cocktail glasses.',
        type: 'Garnish',
        alcohol_content: 0,
        image: chiliPowderImage
    },
    {
        id: 'blue-curacao',
        name: 'Blue Curaçao (Non-Alcoholic)',
        description: 'Citrusy blue liqueur flavoring used for color and flavor in mocktails.',
        type: 'Flavoring',
        alcohol_content: 0,
        image: blueCuracaoImage
    },
    {
        id: 'rose-water',
        name: 'Rose Water',
        description: 'Floral aromatic used to add delicate rose essence.',
        type: 'Flavoring',
        alcohol_content: 0,
        image: roseWaterImage
    },
    {
        id: 'lavender-syrup',
        name: 'Lavender Syrup',
        description: 'Floral syrup with calming notes, great in herbal or tea-based cocktails.',
        type: 'Syrup',
        alcohol_content: 0,
        image: lavenderSyrupImage
    },
    {
        id: 'matcha-powder',
        name: 'Matcha Powder',
        description: 'Finely ground green tea powder used in creative cocktails for earthiness.',
        type: 'Powder',
        alcohol_content: 0,
        image: matchaPowderImage
    },
    {
        id: 'green-tea',
        name: 'Green Tea',
        description: 'Light and earthy brewed tea, used in refreshing and antioxidant-rich cocktails.',
        type: 'Tea',
        alcohol_content: 0,
        image: greenTeaImage
    },
    {
        id: 'soju',
        name: 'Soju',
        description: 'A clear, low-alcohol Korean spirit traditionally made from rice or sweet potatoes.',
        type: 'Spirit',
        alcohol_content: 20,
        image: sojuImage
    },
    {
        id: 'bacardi',
        name: 'Bacardi',
        description: 'A popular brand of white rum with light, crisp notes, great for classic cocktails.',
        type: 'Spirit',
        alcohol_content: 40,
        image: bacardiImage
    },
    {
        id: 'coconut-syrup',
        name: 'Coconut Syrup',
        description: 'Sweet syrup made from coconut, adds a creamy, tropical flavor.',
        type: 'Syrup',
        alcohol_content: 0,
        image: coconutSyrupImage
    },
    {
        id: 'coconut-rum',
        name: 'Coconut Rum',
        description: 'A rum infused with natural coconut flavor, used in tropical cocktails.',
        type: 'Spirit',
        alcohol_content: 21,
        image: coconutRumImage
    },
    {
        id: 'aperol',
        name: 'Aperol',
        description: 'An Italian apéritif with a bittersweet orange flavor and low alcohol content.',
        type: 'Liqueur',
        alcohol_content: 11,
        image: aperolImage
    },
    {
        id: 'cinnamon-syrup',
        name: 'Cinnamon Syrup',
        description: 'Sweet and spicy syrup made with cinnamon sticks, adds warmth to drinks.',
        type: 'Syrup',
        alcohol_content: 0,
        image: cinnamonSyrupImage
    },
    {
        id: 'sour-mix',
        name: 'Sour Mix',
        description: 'A premade blend of lemon or lime juice and sugar, used in sours and margaritas.',
        type: 'Mixer',
        alcohol_content: 0,
        image: sourMixImage
    },
    {
        id: 'orange-bitters',
        name: 'Orange Bitters',
        description: 'Highly concentrated flavoring with citrus and spice notes, used in small dashes.',
        type: 'Bitters',
        alcohol_content: 45,
        image: orangeBittersImage
    },
    {
        id: 'sparkling-water',
        name: 'Sparkling Water',
        description: 'Plain carbonated water used to lighten and freshen up cocktails.',
        type: 'Mixer',
        alcohol_content: 0,
        image: sparklingWaterImage
    },
    {
        id: 'cherry-liqueur',
        name: 'Cherry Liqueur',
        description: 'A sweet, deep red liqueur made from cherries, often used in tiki drinks and desserts.',
        type: 'Liqueur',
        alcohol_content: 30,
        image: cherryLiqueurImage
    },
    {
        id: 'soju',
        name: 'Soju',
        description: 'A clear, low-alcohol Korean spirit traditionally made from rice or sweet potatoes.',
        type: 'Spirit',
        alcohol_content: 20,
        image: sojuImage
    },
    {
        id: 'bacardi',
        name: 'Bacardi',
        description: 'A popular brand of white rum with light, crisp notes, great for classic cocktails.',
        type: 'Spirit',
        alcohol_content: 40,
        image: bacardiImage
    },
    {
        id: 'coconut-syrup',
        name: 'Coconut Syrup',
        description: 'Sweet syrup made from coconut, adds a creamy, tropical flavor.',
        type: 'Syrup',
        alcohol_content: 0,
        image: coconutSyrupImage
    },
    {
        id: 'coconut-rum',
        name: 'Coconut Rum',
        description: 'A rum infused with natural coconut flavor, used in tropical cocktails.',
        type: 'Spirit',
        alcohol_content: 21,
        image: coconutRumImage
    },
    {
        id: 'aperol',
        name: 'Aperol',
        description: 'An Italian apéritif with a bittersweet orange flavor and low alcohol content.',
        type: 'Liqueur',
        alcohol_content: 11,
        image: aperolImage
    },
    {
        id: 'cinnamon-syrup',
        name: 'Cinnamon Syrup',
        description: 'Sweet and cuspicy syrup made with cinnamon sticks, adds warmth to drinks.',
        type: 'Syrup',
        alcohol_content: 0,
        image: cinnamonSyrupImage
    },
    {
        id: 'sour-mix',
        name: 'Sour Mix',
        description: 'A premade blend of lemon or lime juice and sugar, used in sours and margaritas.',
        type: 'Mixer',
        alcohol_content: 0,
        image: sourMixImage
    },
    {
        id: 'orange-bitters',
        name: 'Orange Bitters',
        description: 'Highly concentrated flavoring with citrus and spice notes, used in small dashes.',
        type: 'Bitters',
        alcohol_content: 45,
        image: orangeBittersImage
    },
    {
        id: 'sparkling-water',
        name: 'Sparkling Water',
        description: 'Plain carbonated water used to lighten and freshen up cocktails.',
        type: 'Mixer',
        alcohol_content: 0,
        image: sparklingWaterImage
    },
    {
        id: 'cherry-liqueur',
        name: 'Cherry Liqueur',
        description: 'A sweet, deep red liqueur made from cherries, often used in tiki drinks and desserts.',
        type: 'Liqueur',
        alcohol_content: 30,
        image: cherryLiqueurImage
    },
    {
        id: 'strawberry',
        name: 'Strawberry',
        description: 'Fresh, juicy fruit often muddled or used as a garnish for sweet and fruity cocktails.',
        type: 'Fruit',
        alcohol_content: 0,
        image: strawberryImage
    },
    {
        id: 'strawberry-puree',
        name: 'Strawberry Puree',
        description: 'Smooth and sweet puree made from ripe strawberries, perfect for daiquiris and margaritas.',
        type: 'Puree',
        alcohol_content: 0,
        image: strawberryPureeImage
    },
    {
        id: 'strawberry-syrup',
        name: 'Strawberry Syrup',
        description: 'Sweet and vibrant syrup used to flavor lemonades, sodas, and cocktails.',
        type: 'Syrup',
        alcohol_content: 0,
        image: strawberrySyrupImage
    },
    {
        id: 'strawberry-vodka',
        name: 'Strawberry Vodka',
        description: 'Vodka infused with strawberry flavor, perfect for fruity and refreshing drinks.',
        type: 'Spirit',
        alcohol_content: 35,
        image: strawberryVodkaImage
    },
    {
        id: 'vanilla-vodka',
        name: 'Vanilla Vodka',
        description: 'Flavored vodka with a smooth vanilla finish, used in dessert-style cocktails.',
        type: 'Spirit',
        alcohol_content: 35,
        image: vanillaVodkaImage
    },
    {
        id: 'citrus-vodka',
        name: 'Citrus Vodka',
        description: 'Vodka infused with lemon, lime, or orange peels for a bright and zesty twist.',
        type: 'Spirit',
        alcohol_content: 35,
        image: citrusVodkaImage
    },
    {
        id: 'pepper-vodka',
        name: 'Pepper Vodka',
        description: 'Spicy vodka infused with black pepper or chili, often used in savory drinks like Bloody Marys.',
        type: 'Spirit',
        alcohol_content: 35,
        image: pepperVodkaImage
    },
    {
        id: 'blueberry-vodka',
        name: 'Blueberry Vodka',
        description: 'Fruity vodka infused with blueberry flavor, great in summer drinks.',
        type: 'Spirit',
        alcohol_content: 35,
        image: blueberryVodkaImage
    },
    {
        id: 'rosemary',
        name: 'Fresh Rosemary',
        description: 'Piney herb that adds an herbal depth and aroma to cocktails.',
        type: 'Herb',
        alcohol_content: 0,
        image: rosemaryImage
    },
    {
        id: 'thyme',
        name: 'Fresh Thyme',
        description: 'Fragrant herb that pairs well with gin, vodka, and citrus elements.',
        type: 'Herb',
        alcohol_content: 0,
        image: thymeImage
    },
    {
        id: 'cinnamon-stick',
        name: 'Cinnamon Stick',
        description: 'Used for garnish or muddled to add warm spice to fall or winter cocktails.',
        type: 'Spice',
        alcohol_content: 0,
        image: cinnamonStickImage
    },
    {
        id: 'star-anise',
        name: 'Star Anise',
        description: 'Aromatic spice shaped like a star, adds a subtle licorice note.',
        type: 'Spice',
        alcohol_content: 0,
        image: starAniseImage
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
                            <img
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
                                <div className="ingredient-details">
                                    <p className="ingredient-type">{ingredient.type}</p>
                                    <p className="ingredient-alcohol">
                                        {ingredient.alcohol_content > 0
                                            ? `${ingredient.alcohol_content}% ABV`
                                            : 'Non-alcoholic'}
                                    </p>
                                </div>
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