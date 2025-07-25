import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FireIcon,
  ClockIcon,
  EyeIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(9);

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak diketahui";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return "1 hari yang lalu";
      } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
      } else {
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  // Ambil berita dari backend Express
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://icbs.my.id/api/news/cnn-news/terbaru",
          {
            timeout: 10000,
          }
        );

        if (
          response.data &&
          response.data.articles &&
          Array.isArray(response.data.articles)
        ) {
          const allArticles = response.data.articles;
          setArticles(allArticles);

          // Ambil 5 artikel pertama sebagai trending
          setTrendingArticles(allArticles.slice(0, 5));
        } else {
          setArticles([]);
          setTrendingArticles([]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error.message);
        setArticles([]);
        setTrendingArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Pagination logic
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

  const goToFirstPage = () => paginate(1);
  const goToLastPage = () => paginate(totalPages);
  const goToPrevPage = () => currentPage > 1 && paginate(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && paginate(currentPage + 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse rounded-full h-12 w-12 bg-blue-600 opacity-20"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg font-medium">
            Memuat berita terbaru...
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Belum Ada Artikel
          </h2>
          <p className="text-gray-600 mb-6">
            Tidak ada artikel yang ditemukan saat ini.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-medium"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trending Section */}
        {trendingArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full">
                <FireIcon className="w-5 h-5 mr-2" />
                <span className="font-bold">Sedang Trending</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Featured Article */}
              <div className="lg:col-span-2">
                <Link
                  to={`/detail?url=${encodeURIComponent(trendingArticles[0].link)}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block"
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={
                        (trendingArticles[0].image &&
                          typeof trendingArticles[0].image === "object" &&
                          trendingArticles[0].image.small) ||
                        (typeof trendingArticles[0].image === "string" &&
                          trendingArticles[0].image) ||
                        "https://via.placeholder.com/800x400/e5e7eb/6b7280?text=No+Image"
                      }
                      alt={trendingArticles[0].title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x400/e5e7eb/6b7280?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        #1 Trending
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {trendingArticles[0].title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatDate(trendingArticles[0].pubDate)}
                    </p>
                    {trendingArticles[0].contentSnippet && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {trendingArticles[0].contentSnippet}
                      </p>
                    )}
                    <div className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group-hover:underline">
                      Baca Selengkapnya
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Trending List */}
              <div className="space-y-4">
                {trendingArticles.slice(1, 5).map((article, index) => (
                  <Link
                    key={`trending-${article.link}-${index}`}
                    to={`/detail?url=${encodeURIComponent(article.link)}`}
                    className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-50 block"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 2}
                      </div>
                      <div className="flex space-x-3 flex-1 min-w-0">
                        <img
                          src={
                            (article.image &&
                              typeof article.image === "object" &&
                              article.image.small) ||
                            (typeof article.image === "string" && article.image) ||
                            "https://via.placeholder.com/80x60/e5e7eb/6b7280?text=No+Image"
                          }
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x60/e5e7eb/6b7280?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2 flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDate(article.pubDate)}
                          </p>
                          <div className="text-xs text-blue-600 hover:underline font-medium">
                            Baca →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Articles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Berita Terbaru</h2>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
              Total: {articles.length} artikel
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentArticles.map((article, index) => (
              <div
                key={`${article.link}-${index}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      (article.image &&
                        typeof article.image === "object" &&
                        article.image.small) ||
                      (typeof article.image === "string" && article.image) ||
                      "https://via.placeholder.com/400x200/e5e7eb/6b7280?text=No+Image"
                    }
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200/e5e7eb/6b7280?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {formatDate(article.pubDate)}
                  </p>
                  {article.contentSnippet && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.contentSnippet}
                    </p>
                  )}
                  <Link
                    to={`/detail?url=${encodeURIComponent(article.link)}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:underline"
                  >
                    Baca Selengkapnya
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Menampilkan {indexOfFirstArticle + 1}-
                {Math.min(indexOfLastArticle, articles.length)} dari{" "}
                {articles.length} artikel
              </div>

              <div className="flex items-center space-x-2">
                {/* First Page */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ChevronDoubleLeftIcon className="w-5 h-5" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>

                {/* Last Page */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ChevronDoubleRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}