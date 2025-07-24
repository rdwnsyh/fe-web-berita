// src/api/profile.js
import axios from "axios";

const API_BASE = "https://icbs.my.id/api/user";

const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_BASE}/profile`, config);
  return response.data;
};

const updateProfile = async (token, profileData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.patch(
    `${API_BASE}/edit-profile`,
    profileData,
    config
  );
  return response.data;
};

const changePassword = async (token, passwordData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Kirim oldPassword dan newPassword ke backend
  const response = await axios.post(
    `${API_BASE}/change-password`,
    passwordData,
    config
  );
  return response.data;
};

const updateProfileImage = async (token, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.patch(
    `${API_BASE}/profile/image`, // Updated endpoint
    formData,
    config
  );
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
};
