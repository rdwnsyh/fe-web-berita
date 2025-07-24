import axios from "axios";

const API_BASE_URL = "https://icbs.my.id/api";

// Get all comments for an article
export const getComments = async (articleIdentifier) => {
  const res = await axios.get(
    `${API_BASE_URL}/articles/${articleIdentifier}/comments`
  );
  // API mengembalikan array komentar dengan struktur yang benar
  return {
    data: Array.isArray(res.data) ? res.data : res.data.comments || [],
  };
};

// Post a new comment to an article
export const postComment = async (articleIdentifier, commentData) => {
  // Ambil userId dari localStorage jika ada
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id || user.user || undefined;

  // Validasi: jika userId tidak ada, tolak request
  if (!userId) {
    throw new Error("User belum login. Tidak dapat mengirim komentar.");
  }

  // Payload sesuai backend: text, articleIdentifier, parentId, user
  const payload = {
    text: commentData.content,
    articleIdentifier,
    parentId: null,
    user: userId,
  };
  const res = await axios.post(
    `${API_BASE_URL}/articles/${articleIdentifier}/comments`,
    payload
  );
  return { data: res.data };
};

// Get replies for a comment
export const getReplies = async (parentCommentId) => {
  const res = await axios.get(
    `${API_BASE_URL}/comments/${parentCommentId}/replies`
  );
  return {
    data: Array.isArray(res.data) ? res.data : res.data.replies || [],
  };
};

// Post a reply to a comment
export const postReply = async (parentCommentId, replyData) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id || user.user || undefined;

  if (!userId) {
    throw new Error("User belum login. Tidak dapat mengirim balasan.");
  }

  const payload = {
    text: replyData.content,
    parentId: parentCommentId,
    user: userId,
  };
  const res = await axios.post(
    `${API_BASE_URL}/comments/${parentCommentId}/replies`,
    payload
  );
  return { data: res.data };
};
