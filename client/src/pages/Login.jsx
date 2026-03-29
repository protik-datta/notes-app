import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: data.email }));
      onLoginSuccess(data.email);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-200 mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome Back
          </h1>
          <p className="text-stone-500 text-sm">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-stone-900/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-600 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
