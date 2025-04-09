import React from 'react';

const CartDebug = ({ cartItems }) => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '12px',
            zIndex: 999,
            maxWidth: '200px',
            maxHeight: '100px',
            overflow: 'auto'
        }}>
            <div>Cart Items: {cartItems.length}</div>
            <div>{cartItems.map(item => item.name).join(', ')}</div>
        </div>
    );
};

export default CartDebug; 