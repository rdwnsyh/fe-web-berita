import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginForm } from "../../components/Form/NewsForm";
import { API_ENDPOINTS } from "../../api/Auth";
import { AlertCustomAnimation } from "../../components/Alert/Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to clear alerts
  const clearAlerts = () => {
    setError("");
    setSuccess("");
  };

  // Clear error when user starts typing
  const handleEmailChange = (value) => {
    setEmail(value);
    if (error) setError("");
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAlerts();

    // Basic validation
    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password tidak boleh kosong");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        email: email.trim().toLowerCase(),
        password,
      });

      // Store tokens and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Login berhasil! Mengalihkan ke profil...");

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);

      // Handle different error scenarios
      if (err.response?.status === 401) {
        setError("Email atau password salah");
      } else if (err.response?.status === 403) {
        setError("Akun Anda belum diverifikasi. Silakan cek email Anda");
      } else if (err.response?.status >= 500) {
        setError("Terjadi kesalahan server. Silakan coba lagi nanti");
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Login gagal. Silakan coba lagi"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* Alert Messages */}
        {error && (
          <AlertCustomAnimation
            color="red"
            onClose={clearAlerts}
            duration={6000}
          >
            {error}
          </AlertCustomAnimation>
        )}

        {success && (
          <AlertCustomAnimation
            color="green"
            onClose={clearAlerts}
            duration={3000}
          >
            {success}
          </AlertCustomAnimation>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md">
          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            email={email}
            setEmail={handleEmailChange}
            password={password}
            setPassword={handlePasswordChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
