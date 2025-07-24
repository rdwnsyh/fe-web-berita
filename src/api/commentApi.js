import axios from "axios";

const API_BASE_URL = "https://icbs.my.id/api";

// Get all comments for an article
export const getComments = async (articleIdentifier) => {
  return axios.get(`${API_BASE_URL}/articles/${articleIdentifier}/comments`);
};

// Post a new comment to an article
export const postComment = async (articleIdentifier, commentData) => {
  return axios.post(
    `${API_BASE_URL}/articles/${articleIdentifier}/comments`,
    commentData
  );
};

// Get replies for a comment
export const getReplies = async (parentCommentId) => {
  return axios.get(`${API_BASE_URL}/comments/${parentCommentId}/replies`);
};

// Post a reply to a comment
export const postReply = async (parentCommentId, replyData) => {
  return axios.post(
    `${API_BASE_URL}/comments/${parentCommentId}/replies`,
    replyData
  );
};
