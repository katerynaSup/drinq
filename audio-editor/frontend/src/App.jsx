import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import BarNavbar from './components/BarNavbar';
import IngredientsSearchPage from './components/IngredientsSearchPage';
import DrinksPage from './components/DrinksPage';
import DrinkDetailPage from './components/DrinkDetailPage';
import LandingPage from './components/LandingPage';
import RecommendationPage from './components/RecommendationPage';
import AIBartenderPage from './components/AIBartenderPage';
import Bar from './components/Bar';
import Coaster from './components/Coaster';

function App() {
    const [barItems, setBarItems] = useState([]);
    const [isBarOpen, setIsBarOpen] = useState(false);
    const [coasterMessage, setCoasterMessage] = useState('');
    const [showCoaster, setShowCoaster] = useState(false);

    // Load bar items from localStorage on initial load
    useEffect(() => {
        const savedBarItems = localStorage.getItem('barItems');
        if (savedBarItems) {
            try {
                setBarItems(JSON.parse(savedBarItems));
            } catch (error) {
                console.error('Error loading saved bar items:', error);
            }
        }
    }, []);

    // Function to add an ingredient to the bar
    const handleAddToBar = (ingredient) => {
        // Check if the ingredient is already in the bar
        if (!barItems.some(item => item.id === ingredient.id)) {
            // Add the ingredient to the bar
            const updatedBarItems = [...barItems, ingredient];
            setBarItems(updatedBarItems);

            // Save to localStorage
            localStorage.setItem('barItems', JSON.stringify(updatedBarItems));

            // Show a notification
            setCoasterMessage(`Added ${ingredient.name} to your bar!`);
            setShowCoaster(true);
        } else {
            // Already in bar, show message
            setCoasterMessage(`${ingredient.name} is already in your bar!`);
            setShowCoaster(true);
        }
    };

    // Function to remove an item from the bar
    const handleRemoveFromBar = (ingredientId) => {
        const updatedBarItems = barItems.filter(item => item.id !== ingredientId);
        setBarItems(updatedBarItems);
        localStorage.setItem('barItems', JSON.stringify(updatedBarItems));
    };

    const handleToggleBar = () => {
        setIsBarOpen(!isBarOpen);
    };

    const handleCloseBar = () => {
        setIsBarOpen(false);
    };

    const handleCoasterClose = () => {
        setShowCoaster(false);
    };

    // const handleGenerateDrinks = () => {
    //     // Implement the AI drink generation logic here
    //     console.log("Generating drinks with ingredients:", barItems);
    //     setIsBarOpen(false);
    // };

    const handleGenerateDrinks = () => {
        // Navigate to AI Bartender page with current bar items
        window.location.href = '/ai-bartender';
        setIsBarOpen(false);
    };

    return (
        <Router>
            <div className="app">
                <BarNavbar
                    barItemCount={barItems.length}
                    onBarClick={handleToggleBar}
                />

                <Bar
                    barItems={barItems}
                    onRemoveItem={handleRemoveFromBar}
                    isOpen={isBarOpen}
                    onClose={handleCloseBar}
                    onGenerateDrinks={handleGenerateDrinks}
                />

<Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/recommendationPage" element={<RecommendationPage />} />
                    <Route path="/drinks" element={<DrinksPage />} />
                    <Route path="/drinks/:id" element={<DrinkDetailPage />} />
                    <Route path="/ai-bartender" element={<AIBartenderPage />} />
                    <Route path="/ingredients" element={
                        <IngredientsSearchPage
                            onAddToBar={handleAddToBar}
                            barItems={barItems}
                            onRemoveFromBar={handleRemoveFromBar}
                            onGenerateDrinks={handleGenerateDrinks}
                        />
                    } />
                </Routes>

                <Coaster
                    message={coasterMessage}
                    visible={showCoaster}
                    onClose={handleCoasterClose}
                />
            </div>
        </Router>
    );
}

export default App;