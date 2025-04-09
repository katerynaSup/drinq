import React from 'react';
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ cartItems, onRemoveItem, isOpen, onClose }) => {
    if (!isOpen) return null;

    const totalItems = cartItems.length;

    return (
        <div className="shopping-cart-overlay">
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
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.image_url || '/images/ingredients/default.jpg'}
                                        alt={item.name}
                                        className="cart-item-image"
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
                            <button className="checkout-button">Find Drinks With These</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart; 