import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsNavbar from "./components/Navbar/NewsNavbar";
import Category from "./pages/Category";
import NewsDetail from "./pages/NewsDetail";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Router>
      <div className="App">
        <NewsNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/news/detail" element={<NewsDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/users" element={<UserManagement />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

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
