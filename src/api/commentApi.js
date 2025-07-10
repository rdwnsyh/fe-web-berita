import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getComments = async (articleId) => {
  return axios.get(`${API_BASE_URL}/comment?articleId=${articleId}`);
};

export const postComment = async (commentData) => {
  return axios.post(`${API_BASE_URL}/comment`, commentData);
};
