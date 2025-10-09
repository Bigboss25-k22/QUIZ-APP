import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { registerUser } from "@/lib/api/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { loading, error, callApi } = useApi(registerUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return;
    if (password.length < 6) return;
    if (password !== confirmPassword) return;
    try {
      await callApi({ email, password });
      navigate("/login");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-xl border border-border bg-white/90 dark:bg-background/90">
        <div className="flex flex-col items-center mb-6">
          <img src="https://res.cloudinary.com/duxrwlvtv/image/upload/v1755590827/e3184f9f-e4a4-48e2-aa99-bb5f77a7867f_jyk4s8.jpg" alt="logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold mb-2">Quiz App</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold mb-2 text-center">Create your account</h2>
          <button type="button" className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2 font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-foreground/60">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-2 animate-fade-in">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              <span className="flex-1 text-sm">{error}</span>
            </div>
          )}
          <div>
            <label className="text-left block mb-1 font-medium">Your email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background dark:bg-background focus:outline-none focus:border-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="text-left block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background dark:bg-background focus:outline-none focus:border-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-left block mb-1 font-medium">Confirm password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background dark:bg-background focus:outline-none focus:border-primary"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full mt-2 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-colors text-lg disabled:opacity-60" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Sign up"}
          </button>
        </form>
        <div className="text-center text-sm mt-6 text-foreground/70">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
