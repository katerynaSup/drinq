import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Force the width settings via JS as well
document.documentElement.style.setProperty('--max-content-width', '1900px');
document.documentElement.style.setProperty('--global-max-width', '1900px');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)