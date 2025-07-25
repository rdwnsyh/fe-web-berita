import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Trending() {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ganti endpoint sesuai backend trending
        const res = await axios.get("https://icbs.my.id/api/news/trending");
        setTrendingArticles(res.data.articles || []);
      } catch (err) {
        setError("Gagal memuat artikel trending.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800">Memuat trending...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-red-600 mb-4">{error}</h3>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Sedang Trending</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {trendingArticles.map((article, idx) => (
            <div key={article.link || idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer" onClick={() => navigate(`/news-detail?url=${encodeURIComponent(article.link)}`)}>
              {article.image && (
                <img src={typeof article.image === "object" ? article.image.small : article.image} alt={article.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{article.pubDate || "Tanggal tidak diketahui"}</p>
              <p className="text-gray-700 text-sm mb-4">{article.contentSnippet}</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Baca di sumber asli</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
