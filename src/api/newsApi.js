import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/news"; // Sesuai prefix router

// 🔹 GET daftar berita CNN berdasarkan kategori
export const getNewsByCategory = async (category) => {
  return axios.get(`${API_BASE_URL}/cnn-news/${category}`);
};

// 🔹 GET konten detail dengan scraping puppeteer
export const getNewsContent = async (url) => {
  return axios.get(`${API_BASE_URL}/content`, {
    params: { url }, // Kirim parameter ?url=...
  });
};
