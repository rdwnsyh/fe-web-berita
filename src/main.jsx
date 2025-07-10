import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/App.css'; // Global CSS
import './styles/Footer.css'; // Footer styles
import './index.css'; // Importing index.css for global styles


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);