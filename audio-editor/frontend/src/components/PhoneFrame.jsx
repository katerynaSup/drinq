import React from 'react';
import '../styles/PhoneFrame.css';

const PhoneFrame = ({ children }) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="phone-frame-wrapper">
            <div className="phone-frame">
                <div className="phone-top-notch">
                    <div className="notch-content">
                        <div className="phone-camera"></div>
                    </div>
                </div>
                <div className="phone-status-bar">
                    <div className="status-time">{currentTime}</div>
                    <div className="status-icons">
                        <div className="status-icon">📶</div>
                        <div className="status-icon">📊</div>
                        <div className="status-icon">🔋</div>
                    </div>
                </div>
                <div className="phone-screen">
                    {children}
                </div>
                <div className="phone-home-indicator"></div>
            </div>
        </div>
    );
};

export default PhoneFrame; 