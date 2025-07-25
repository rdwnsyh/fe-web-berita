import axios from "axios";

const API_BASE_URL = "https://icbs.my.id/api";

// Ambil token dari localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.token || "";
};

// Axios instance dengan interceptor auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📌 Ambil semua komentar untuk sebuah artikel
export const getComments = async (articleIdentifier) => {
  const res = await apiClient.get(`/articles/${articleIdentifier}/comments`);
  return res.data;
};

// 📌 Kirim komentar baru ke sebuah artikel
export const postComment = (articleIdentifier, data, token) => {
  return axios.post(
    `/api/comments/articles/${articleIdentifier}/comments`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

// 📌 Ambil semua balasan untuk komentar tertentu
export const getReplies = async (parentCommentId) => {
  const res = await apiClient.get(`/comments/${parentCommentId}/replies`);
  return { data: res.data };
};

// 📌 Kirim balasan ke komentar
export const postReply = async (parentCommentId, replyData) => {
  const res = await apiClient.post(`/comments/${parentCommentId}/replies`, {
    text: replyData.content,
  });
  return { data: res.data };
};
