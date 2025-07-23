import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/Auth";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Fetch expired time from backend
  useEffect(() => {
    const fetchOtpExpiry = async () => {
      try {
        const res = await axios.post(API_ENDPOINTS.checkOtpExpiry, { email });
        const expiry = new Date(res.data.expiresAt).getTime();
        const now = Date.now();
        const diffInSeconds = Math.max(Math.floor((expiry - now) / 1000), 0);
        setTimer(diffInSeconds);
      } catch (err) {
        console.error("Gagal mengambil data OTP:", err);
      }
    };
    if (email) fetchOtpExpiry();
  }, [email]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(API_ENDPOINTS.verify, { email, otp });
      navigate("/login");
    } catch (err) {
      setError("OTP salah atau sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const res = await axios.post(API_ENDPOINTS.resend, { email });
      const expiry = new Date(res.data.expiresAt).getTime();
      const now = Date.now();
      const diffInSeconds = Math.max(Math.floor((expiry - now) / 1000), 0);
      setTimer(diffInSeconds);
    } catch (err) {
      setError("Gagal mengirim ulang OTP. Silakan coba lagi.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Verifikasi OTP</h2>
        <p className="mb-2 text-center text-gray-600">
          Masukkan kode OTP yang dikirim ke email{" "}
          <span className="font-semibold">{email}</span>
        </p>
        <p className="mb-4 text-center text-blue-600 font-medium">
          Kode OTP hanya berlaku selama{" "}
          <span className="font-bold">{timer}</span> detik.
        </p>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Kode OTP"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Verifikasi"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timer > 0 || resendLoading}
            className={`w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors ${
              timer > 0 || resendLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendLoading ? "Mengirim..." : "Kirim Ulang OTP"}
          </button>
          {timer === 0 && (
            <div className="text-center text-sm text-gray-500 mt-2">
              Waktu habis. Silakan kirim ulang kode OTP.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otp;
