import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RegisterForm } from "../../components/Form/NewsForm";
import { API_ENDPOINTS } from "../../api/Auth"; // Tambahkan ini

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.displayName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Semua field harus diisi");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.register, {
        displayName: formData.displayName,
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      navigate("/otp", { state: { email: formData.email.toLowerCase() } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registrasi gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <RegisterForm
          onSubmit={handleSubmit}
          error={error}
          success={success}
          loading={loading}
          formData={formData}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Register;
