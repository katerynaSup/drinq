import React, { useEffect, useState } from 'react';
import '../styles/Coaster.css';

const Coaster = ({ message, visible, onClose }) => {
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        setIsVisible(visible);
        if (visible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    return (
        <div className={`coaster ${isVisible ? 'visible' : ''}`}>
            <p>{message}</p>
        </div>
    );
};

export default Coaster; 