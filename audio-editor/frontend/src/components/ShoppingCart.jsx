import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ cartItems, onRemoveItem, isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const totalItems = cartItems.length;

    const handleFindDrinks = () => {
        // Close the cart
        onClose();

        // Navigate to recommendations page with cart items as state
        navigate('/ingredient-recommendations', {
            state: { ingredients: cartItems }
        });
    };

    console.log("Cart is open, items:", cartItems); // Debug output

    return (
        <div className="shopping-cart-overlay" onClick={(e) => {
            // Close when clicking overlay but not cart itself
            if (e.target.className === 'shopping-cart-overlay') {
                onClose();
            }
        }}>
            <div className="shopping-cart">
                <div className="cart-header">
                    <h2>Your Ingredients</h2>
                    <button className="close-cart-button" onClick={onClose}>×</button>
                </div>

                {totalItems === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <p className="empty-cart-subtext">Add some ingredients to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.image || '/images/ingredients/default.jpg'}
                                        alt={item.name}
                                        className="cart-item-image"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            e.target.src = '/images/ingredients/default.jpg';
                                            console.log("Image failed to load:", item.image_url);
                                        }}
                                    />
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <span className="cart-item-type">{item.type}</span>
                                    </div>
                                    <button
                                        className="remove-item-button"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-summary">
                                <span>Total Items: {totalItems}</span>
                            </div>
                            <button
                                className="checkout-button"
                                onClick={handleFindDrinks}
                            >
                                Find Drinks With These
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart; 