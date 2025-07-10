import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil berita dari backend Express
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/news/cnn-news/nasional"
        );
        setArticles(response.data.data); // pastikan format responsnya sesuai
      } catch (error) {
        console.error("Gagal fetch berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading berita...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Berita Terbaru</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{article.pubDate}</p>
              <Link
                to={`/detail?url=${encodeURIComponent(article.link)}`}
                className="inline-block text-blue-600 hover:underline"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
