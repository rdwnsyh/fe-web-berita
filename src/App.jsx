import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsNavbar from "./components/Navbar/NewsNavbar";
import Home from "./pages/Home";
import Category from "./pages/Category";

export default function App() {
  return (
    <BrowserRouter>
      <NewsNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
}
