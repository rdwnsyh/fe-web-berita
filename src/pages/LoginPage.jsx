// src/pages/LoginPage.jsx
import React, { useState } from "react";
import '../styles/AuthForms.css'; // <-- Import CSS file

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        alert("Logged in with username: " + username);
    };

    return (
        // Hapus tag <style>
        <div className="auth-container" role="main" aria-label="Login Form"> {/* Ubah kelas */}
            <h1 className="auth-title"> {/* Ubah kelas */}
                Hello<br />
                <span className="highlight">Again!</span>
            </h1>
            <p className="auth-subtitle">Welcome back you&apos;ve been missed</p> {/* Ubah kelas */}

            <form onSubmit={handleLogin} aria-describedby="login-instructions">
                <label htmlFor="username">
                    Username<span className="required" aria-hidden="true">*</span>
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                    aria-required="true"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />

                <label htmlFor="password" style={{ marginTop: "18px" }}>
                    Password<span className="required" aria-hidden="true">*</span>
                </label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        aria-required="true"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <div className="checkbox-container">
                    <label htmlFor="remember" className="checkbox-label">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <a href="#forgot-password" className="form-link" aria-label="Forgot password link"> {/* Ubah kelas */}
                        Forgot the password ?
                    </a>
                </div>

                <button type="submit" className="auth-btn" aria-live="polite"> {/* Ubah kelas */}
                    Login
                </button>
            </form>

            <div className="divider-text" aria-hidden="true">
                or continue with
            </div>

            <div className="social-buttons" role="region" aria-label="Social login options">
                <button
                    type="button"
                    className="social-btn facebook"
                    aria-label="Login with Facebook"
                    onClick={() => alert("Login with Facebook")}
                >
                    <svg
                        className="social-icon"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                    >
                        <path d="M22.675 0h-21.35C.599 0 0 .6 0 1.337v21.326C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.412c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.098 2.795.142v3.24l-1.918.001c-1.505 0-1.796.715-1.796 1.764v2.314h3.592l-.467 3.622h-3.125V24h6.127c.725 0 1.324-.6 1.324-1.337V1.337C24 .6 23.4 0 22.675 0z" />
                    </svg>
                    Facebook
                </button>
                <button
                    type="button"
                    className="social-btn google"
                    aria-label="Login with Google"
                    onClick={() => alert("Login with Google")}
                >
                    <svg
                        className="social-icon"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21.35 11.1H12v2.8h5.35a4.58 4.58 0 01-2 2.95v2.45h3.2a8.2 8.2 0 002.95-7.95z" fill="#4285F4" />
                        <path d="M12 22c2.7 0 4.95-.9 6.6-2.45l-3.2-2.45a5.53 5.53 0 01-6.6-7.3V7.6H6.2v2.8A10 10 0 0012 22z" fill="#34A853" />
                        <path d="M6.2 13.9v-3.8H3.95A10 10 0 003.95 12c0 1.5.3 2.9.7 4.2l2.55-2.3z" fill="#FBBC05" />
                        <path d="M12 6.5a5.6 5.6 0 014 1.55l2.95-2.9A9.9 9.9 0 0012 2.3a9.5 9.5 0 00-8.15 4.7l2.5 2.4A5.6 5.6 0 0112 6.5z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
            </div>

            <p className="auth-text"> {/* Ubah kelas */}
                don&apos;t have an account?{" "}
                <Link to="/register" className="form-link" aria-label="Sign Up link"> {/* Gunakan Link dari react-router-dom */}
                    Sign Up
                </Link>
            </p>
            <p style={{ textAlign: "center", marginTop: "6px", fontSize: "0.85rem" }}>
                <a href="#forgot-password" className="form-link" aria-label="Forgot password link"> {/* Ubah kelas */}
                    forgot password?
                </a>
            </p>
        </div>
    );
}