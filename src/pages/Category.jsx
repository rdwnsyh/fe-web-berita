import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsByCategory } from "../api/newsApi";

export default function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("terbaru");

  // Mapping kategori untuk menampilkan nama yang lebih user-friendly
  const categoryNames = {
    terbaru: "Terbaru",
    nasional: "Nasional",
    internasional: "Internasional",
    ekonomi: "Ekonomi",
    olahraga: "Olahraga",
    teknologi: "Teknologi",
    hiburan: "Hiburan",
    "gaya-hidup": "Gaya Hidup", // gunakan strip!
  };

  // Fungsi untuk fetch berita berdasarkan kategori
  const fetchNews = async (category) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching news for category: ${category}`);

      const response = await getNewsByCategory(category);
      console.log("API Response:", response);

      // Validasi struktur response
      if (response && response.data) {
        const newsData = response.data.articles || [];
        setNewsList(Array.isArray(newsData) ? newsData : []);
      } else {
        setNewsList([]);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(
        `Gagal memuat berita untuk kategori ${
          categoryNames[category] || category
        }. Silakan coba lagi.`
      );
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      // Validasi slug kategori
      const validCategories = Object.keys(categoryNames);

      if (!validCategories.includes(slug)) {
        setError(`Kategori "${slug}" tidak ditemukan.`);
        setLoading(false);
        return;
      }

      fetchNews(slug);
    } else {
      setError("Kategori tidak valid.");
      setLoading(false);
    }
  }, [slug]);

  const handleNewsClick = (item) => {
    if (item.link) {
      const encodedUrl = encodeURIComponent(item.link);
      navigate(`/news/detail?url=${encodedUrl}`);
    } else {
      console.warn("News item has no link:", item);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    // Implementasi sorting
    let sortedNews = [...newsList];

    switch (value) {
      case "terbaru":
        sortedNews.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
        break;
      case "terlama":
        sortedNews.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
        break;
      case "terpopuler":
        // Implementasi sorting berdasarkan popularitas jika ada field tersebut
        // Untuk sementara, gunakan sorting berdasarkan judul
        sortedNews.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default:
        break;
    }

    setNewsList(sortedNews);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";

      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  const formatDescription = (desc) => {
    if (!desc) return "Deskripsi tidak tersedia";
    const cleanDesc = desc.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return cleanDesc.length > 150
      ? cleanDesc.substring(0, 150) + "..."
      : cleanDesc;
  };

  const handleRetry = () => {
    if (slug) {
      fetchNews(slug);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <svg
                className="mx-auto h-16 w-16 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-x-4">
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-600 transition-colors"
            >
              Beranda
            </button>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              {categoryNames[slug] || slug}
            </span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryNames[slug] || slug}
              </h1>
              <p className="text-gray-600 mt-1">
                {newsList.length} berita ditemukan
              </p>
            </div>

            {/* Sort/Filter Options */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terpopuler">Terpopuler</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item, idx) => (
              <article
                key={item.link || idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleNewsClick(item)}
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={
                        (item.image &&
                          typeof item.image === "object" &&
                          item.image.small) ||
                        (typeof item.image === "string" && item.image) ||
                        "/no-image.png"
                      }
                      alt={item.title || "Gambar berita"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling &&
                          (e.target.nextElementSibling.style.display = "flex");
                      }}
                    />
                  ) : null}

                  {/* Fallback for missing image */}
                  <div
                    className="absolute inset-0 bg-gray-200 flex items-center justify-center"
                    style={{ display: item.image ? "none" : "flex" }}
                  >
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {categoryNames[slug] || slug}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {item.title || "Judul tidak tersedia"}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {formatDescription(item.description || item.contentSnippet)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(item.isoDate || item.pubDate)}</span>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Baca selengkapnya</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada berita
            </h3>
            <p className="text-gray-600">
              Belum ada berita tersedia untuk kategori{" "}
              <span className="font-semibold">
                {categoryNames[slug] || slug}
              </span>
              .
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
