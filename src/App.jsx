// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import Header from './components/shared/header';
import Footer from './components/shared/footer';

// Dummy pages (buat dulu file-nya di folder /pages jika belum ada)
import TrendingPage from './pages/TrendingPage';
import BookmarkPage from './pages/BookmarkPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';

import '../src/styles/App.css'; // Pastikan path ini sesuai dengan struktur folder Anda

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <main style={{ padding: '20px 20px 80px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
