// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '3em', color: '#dc3545' }}>404</h1>
            <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1em',
                transition: 'background-color 0.2s ease-in-out'
            }}>
                Go to Homepage
            </Link>
        </div>
    );
}

export default NotFoundPage;