// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import '../styles/AuthForms.css'; // <-- Import CSS file

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // Tambahkan state untuk email
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Untuk konfirmasi password
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // Implement register logic here
        alert("Registered with username: " + username + " and email: " + email);
        // Di sini nanti kamu akan memanggil API backend untuk register
    };

    return (
        <div className="auth-container" role="main" aria-label="Register Form">
            <h1 className="auth-title">
                Join Our<br />
                <span className="highlight">Community!</span>
            </h1>
            <p className="auth-subtitle">Create your account to get started</p>

            <form onSubmit={handleRegister} aria-describedby="register-instructions">
                <label htmlFor="username">
                    Username<span className="required" aria-hidden="true">*</span>
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    required
                    aria-required="true"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />

                <label htmlFor="email" style={{ marginTop: "18px" }}>
                    Email<span className="required" aria-hidden="true">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                    aria-required="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
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

                <label htmlFor="confirm-password" style={{ marginTop: "18px" }}>
                    Confirm Password<span className="required" aria-hidden="true">*</span>
                </label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="confirm-password"
                        name="confirmPassword"
                        required
                        aria-required="true"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>

                <button type="submit" className="auth-btn" style={{ marginTop: "22px" }} aria-live="polite">
                    Register
                </button>
            </form>

            <div className="divider-text" aria-hidden="true">
                or register with
            </div>

            <div className="social-buttons" role="region" aria-label="Social registration options">
                <button
                    type="button"
                    className="social-btn facebook"
                    aria-label="Register with Facebook"
                    onClick={() => alert("Register with Facebook")}
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
                    aria-label="Register with Google"
                    onClick={() => alert("Register with Google")}
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

            <p className="auth-text">
                Already have an account?{" "}
                <Link to="/login" className="form-link" aria-label="Login link">
                    Login
                </Link>
            </p>
        </div>
    );
}