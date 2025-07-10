import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularCategories = [
    { name: "Terbaru", href: "/terbaru" },
    { name: "Nasional", href: "/nasional" },
    { name: "Teknologi", href: "/teknologi" },
    { name: "Olahraga", href: "/olahraga" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Large 404 illustration */}
          <div className="mx-auto flex items-center justify-center h-32 w-32 mb-8">
            <svg
              className="h-32 w-32 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman
            tersebut telah dipindahkan atau dihapus.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Kembali ke Beranda
            </button>

            <button
              onClick={handleGoBack}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Kembali ke Halaman Sebelumnya
            </button>
          </div>
        </div>
      </div>

      {/* Popular categories suggestion */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Atau jelajahi kategori populer:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="text-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex flex-col items-center">
                  <svg
                    className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2"
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
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    {category.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
