import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// Added Link import
import { RegisterForm } from "../../components/Form/NewsForm";
import { API_ENDPOINTS } from "../../api/Auth";
import { AlertCustomAnimation } from "../../components/Alert/Alert";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to clear alerts
  const clearAlerts = () => {
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    // Check empty fields
    if (!username.trim()) {
      setError("Username tidak boleh kosong");
      return false;
    }

    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      return false;
    }

    if (!password) {
      setError("Password tidak boleh kosong");
      return false;
    }

    if (!confirmPassword) {
      setError("Konfirmasi password tidak boleh kosong");
      return false;
    }

    // Validate username
    if (username.trim().length < 3) {
      setError("Username minimal 3 karakter");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError("Username hanya boleh mengandung huruf, angka, dan underscore");
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Format email tidak valid");
      return false;
    }

    // Validate password
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka"
      );
      return false;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAlerts();

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.register, {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setSuccess("Registrasi berhasil! Mengalihkan ke halaman OTP...");

      // Redirect to OTP page after showing success message
      setTimeout(() => {
        navigate("/otp", {
          state: {
            email: formData.email.trim().toLowerCase(),
            username: formData.username.trim(),
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      // Handle different error scenarios
      if (err.response?.status === 409) {
        const errorData = err.response.data;
        if (errorData.field === "email") {
          setError("Email sudah terdaftar. Silakan gunakan email lain");
        } else if (errorData.field === "username") {
          setError("Username sudah digunakan. Silakan pilih username lain");
        } else {
          setError("Email atau username sudah terdaftar");
        }
      } else if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Data yang dimasukkan tidak valid"
        );
      } else if (err.response?.status >= 500) {
        setError("Terjadi kesalahan server. Silakan coba lagi nanti");
      } else {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Registrasi gagal. Silakan coba lagi"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* <div className="text-center"> */}
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Kembali ke Beranda
        </Link>
        {/* </div> */}
        {/* Alert Messages */}
        {error && (
          <AlertCustomAnimation
            color="red"
            onClose={clearAlerts}
            duration={7000}
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

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-md">
          <RegisterForm
            onSubmit={handleSubmit}
            loading={loading}
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
