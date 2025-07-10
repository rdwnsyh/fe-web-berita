import React, { useState } from "react";
import { Input, Button, Typography, Alert } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
      const response = await axios.post("/api/auth/register", {
        displayName: formData.displayName,
        email: formData.email.toLowerCase(), // Normalisasi email
        password: formData.password,
      });

      // Simpan token dan data user jika register langsung login
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setSuccess(
        response.data.message || "Registrasi berhasil! Silakan login."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Handle error response dari backend
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Typography variant="h2" className="mt-6 text-center text-gray-900">
            Buat Akun Baru
          </Typography>
        </div>

        {error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="green" className="mb-4">
            {success}
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                type="text"
                name="displayName"
                label="Nama Tampilan"
                value={formData.displayName}
                onChange={handleChange}
                required
                size="lg"
                error={!!error}
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
                size="lg"
                error={!!error}
              />
            </div>
            <div>
              <Input
                type="password"
                name="password"
                label="Password (minimal 8 karakter)"
                value={formData.password}
                onChange={handleChange}
                required
                size="lg"
                error={!!error}
              />
            </div>
            <div>
              <Input
                type="password"
                name="confirmPassword"
                label="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                size="lg"
                error={!!error}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              color="blue"
              size="lg"
              fullWidth
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Typography variant="small" className="mt-4">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Masuk disini
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Register;
