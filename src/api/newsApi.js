import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_NEWS_API_BASE_URL || "https://icbs.my.id/api/news";

// 🔹 GET daftar berita CNN berdasarkan kategori
export const getNewsByCategory = async (category) => {
  return axios.get(`${API_BASE_URL}/cnn-news/${category}`);
};

// 🔹 GET detail konten berita dari URL
export const getNewsContent = async (url) => {
  return axios.get(`${API_BASE_URL}/content`, {
    params: { url },
  });
};
