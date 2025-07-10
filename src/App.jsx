import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsNavbar from "./components/Navbar/NewsNavbar";
import Category from "./pages/Category";
import NewsDetail from "./pages/NewsDetail";
import Home from "./pages/Home";
// import Search from "./components/Search";
// import Trending from "./components/Trending";

function App() {
  return (
    <Router>
      <div className="App">
        <NewsNavbar />
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Category Routes */}
          <Route path="/category/:slug" element={<Category />} />

          {/* News Detail Route */}
          <Route path="/news/detail" element={<NewsDetail />} />

          {/* Search Route */}
          {/* <Route path="/search" element={<Search />} /> */}

          {/* Trending Route */}
          {/* <Route path="/trending" element={<Trending />} /> */}

          {/* Profile Routes */}
          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/bookmarks" element={<div>Bookmarks Page</div>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// 404 Component
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}

export default App;
