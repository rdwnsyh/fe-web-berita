import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FireIcon,
  ClockIcon,
  EyeIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Enhanced Navbar Component with Dynamic Blur
function NewsNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Enhanced scroll effect for navbar blur and hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setScrolled(isScrolled);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Mock user data
  // const user = { email: "user@example.com", photoUrl: null, role: "user" };

  // Ambil user dari localStorage agar konsisten dengan referensi
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const categories = [
    { name: "Terbaru", slug: "terbaru", apiCategory: "terbaru" },
    { name: "Nasional", slug: "nasional", apiCategory: "nasional" },
    {
      name: "Internasional",
      slug: "internasional",
      apiCategory: "internasional",
    },
    { name: "Ekonomi", slug: "ekonomi", apiCategory: "ekonomi" },
    { name: "Olahraga", slug: "olahraga", apiCategory: "olahraga" },
    { name: "Teknologi", slug: "teknologi", apiCategory: "teknologi" },
    { name: "Hiburan", slug: "hiburan", apiCategory: "hiburan" },
    { name: "Gaya Hidup", slug: "gayahidup", apiCategory: "gayahidup" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search query:", searchQuery);
    }
  };

  const handleCategoryClick = (category) => {
    setIsMenuOpen(false);
    console.log(`Navigating to category: ${category.slug}`);
    navigate(`/category/${category.slug}`);
  };

  // Tambahkan handler logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl shadow-2xl border-b border-white/10"
          : "bg-white/40 backdrop-blur-xl shadow-lg"
      }`}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          scrolled
            ? "bg-gradient-to-r from-blue-50/40 via-white/50 to-indigo-50/40"
            : "bg-gradient-to-r from-blue-50/20 via-white/30 to-indigo-50/20"
        }`}
      ></div>

      {/* Subtle animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <button className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 transform hover:scale-105 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FOKUS
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  Portal Berita
                </div>
              </div>
            </button>
          </div>

          {/* Enhanced Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* HOME DESKTOP */}
            <button
              className="relative text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/60 backdrop-blur-sm group overflow-hidden"
              onClick={() => navigate("/")}
            >
              <span className="relative">Home</span>
            </button>

            {/* Enhanced Categories Dropdown */}
            <div className="relative group">
              <button className="relative text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/60 backdrop-blur-sm flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Kategori</span>
                <svg
                  className="relative ml-1 h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Ultra Enhanced Dropdown Menu */}
              <div className="absolute left-0 mt-4 w-80 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-indigo-50/60"></div>
                <div className="relative p-6">
                  <div className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
                    Pilih Kategori
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md mx-1 text-left transition-colors"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              className="relative text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/60 backdrop-blur-sm group overflow-hidden"
              onClick={() => navigate("/trending")}
            >
              <span className="relative">Trending</span>
            </button>
          </div>

          {/* Ultra Enhanced Search Bar */}
          <div className="hidden lg:flex items-center">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita terbaru..."
                  className="w-72 pl-12 pr-12 py-3 bg-white/50 backdrop-blur-2xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 focus:bg-white/70 transition-all duration-500 text-sm placeholder-gray-500 shadow-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Ultra Enhanced User Profile */}
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-300 p-2 rounded-2xl hover:bg-white/60 backdrop-blur-sm group-hover:shadow-lg">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                  <img
                    className="relative h-8 w-8 rounded-full object-cover ring-2 ring-white/30 group-hover:ring-blue-500/40 transition-all duration-300"
                    src={
                      user.photoUrl ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    alt="User avatar"
                  />
                </div>
                <svg
                  className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-4 w-64 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-indigo-50/60"></div>
                <div className="relative p-4">
                  <div className="flex items-center space-x-3 p-3 mb-3 bg-white/50 rounded-2xl">
                    <img
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/20"
                      src={
                        user.photoUrl ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt="User avatar"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user.displayName || "User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email || ""}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {!user.email ? (
                      <>
                        <button
                          onClick={() => navigate("/register")}
                          className="group/item relative block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-blue-600 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm rounded-2xl overflow-hidden"
                        >
                          <span className="relative font-medium">Daftar</span>
                        </button>
                        <button
                          onClick={() => navigate("/login")}
                          className="group/item relative block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-blue-600 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm rounded-2xl overflow-hidden"
                        >
                          <span className="relative font-medium">Masuk</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/profile")}
                          className="group/item relative block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-blue-600 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm rounded-2xl overflow-hidden"
                        >
                          <span className="relative font-medium">
                            Profil Saya
                          </span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="group/item relative block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-red-600 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm rounded-2xl overflow-hidden"
                        >
                          <span className="relative font-medium">Keluar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-3 rounded-2xl hover:bg-white/60 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              {isMenuOpen ? (
                <svg
                  className="relative h-6 w-6 transform rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="relative h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Ultra Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="absolute left-4 right-4 mt-2 bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-indigo-50/60"></div>
              <div className="relative px-6 pt-6 pb-8 space-y-3">
                {/* HOME MOBILE */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/");
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white/60 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm"
                >
                  Home
                </button>

                {/* Mobile Categories */}
                <div className="space-y-3">
                  <div className="px-4 py-2 text-base font-semibold text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
                    Kategori
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category, index) => (
                      <button
                        key={category.slug}
                        onClick={() => navigate(`/kategory/${category.slug}`)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/60 rounded-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white/60 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm"
                >
                  Trending
                </button>

                {/* Mobile Search */}
                <div className="px-4 py-3">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari berita..."
                        className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="px-3 py-2 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        user.photoUrl ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt="User avatar"
                    />
                    <span className="text-gray-700 font-medium">
                      Menu Profil
                    </span>
                  </div>
                  <div className="space-y-1">
                    {!user.email ? (
                      <>
                        <button
                          onClick={() => {
                            navigate("/register");
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Daftar
                        </button>
                        <button
                          onClick={() => {
                            navigate("/login");
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Masuk
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Profil Saya
                        </button>
                        {/* <button
                          onClick={() => {
                            navigate("/bookmarks");
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Bookmark
                        </button> */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Keluar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Enhanced Home Component
function Home() {
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(9);

  // Mock data
  useEffect(() => {
    const mockArticles = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Berita Terbaru ${
        i + 1
      }: Perkembangan Teknologi AI di Indonesia Semakin Pesat`,
      link: `https://example.com/news/${i + 1}`,
      pubDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("id-ID"),
      contentSnippet: `Ini adalah konten berita ${
        i + 1
      }. Jakarta - Perkembangan teknologi kecerdasan buatan (AI) di Indonesia mengalami kemajuan yang sangat signifikan dalam beberapa tahun terakhir. Berbagai sektor mulai mengadopsi teknologi ini untuk meningkatkan efisiensi dan produktivitas.`,
      image: `https://picsum.photos/400/300?random=${i + 1}`,
      category: ["Teknologi", "Nasional", "Ekonomi", "Internasional"][
        Math.floor(Math.random() * 4)
      ],
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
    }));

    setArticles(mockArticles);
    setTrendingArticles(mockArticles.slice(0, 5));
  }, []);

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse rounded-full h-16 w-16 bg-blue-600 opacity-20"></div>
            </div>
          </div>
          <p className="text-gray-600 text-xl font-medium">
            Memuat berita terbaru...
          </p>
          <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <NewsNavbar />

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Ultra Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/10 to-purple-600/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-2">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium text-gray-600 mb-6 border border-white/20 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Portal Berita Terpercaya</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              FOKUS News
            </h1>
            <p className="text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Informasi terkini dan terpercaya dari seluruh Indonesia
            </p>
            <div className="flex items-center justify-center text-lg text-gray-500 bg-white/50 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20">
              <ClockIcon className="w-5 h-5 mr-3" />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2 mt-0">
        {/* Trending Section */}
      </div>
    </div>
  );
}

export default Home;
