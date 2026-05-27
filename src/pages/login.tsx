import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Navbar from "../components/layout/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();

  const successMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      contextLogin(response.token, {
        name: response.name,
        lastName: response.lastName,
        email: email,
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "INVALID CREDENTIALS";
        setError(message.toUpperCase());
      } else {
        setError("CONNECTION ERROR WITH TERMINAL");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-bg-main-light dark:bg-bg-main-dark pt-20 p-4 font-main">
        <div className="w-full max-w-md bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent mb-4 shadow-lg shadow-brand-accent/5">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-title-main font-title text-black dark:text-white tracking-wider uppercase">
              Kanban <span className="text-brand-accent">Flow</span>
            </h1>
            <p className="text-xs font-terminal text-grey-custom dark:text-grey-custom-dark mt-2 italic uppercase tracking-widest">
              Secure Terminal Access
            </p>
          </div>

          {successMessage && !error && (
            <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-terminal-sm font-terminal rounded-xl text-center uppercase tracking-wider animate-pulse">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="System Email"
              type="email"
              placeholder="admin@system.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Access Key"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-terminal-sm font-terminal rounded-xl text-center font-bold animate-pulse uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full py-4 font-title bg-brand-accent text-slate-950 hover:bg-brand-accent/90 tracking-widest uppercase shadow-lg shadow-brand-accent/10"
              >
                {loading ? "VERIFYING..." : "AUTHENTICATE"}
              </Button>
            </div>
          </form>
          <div className="mt-8 text-center space-y-3">
            <div>
              <Link
                to="/register"
                className="text-terminal-sm font-terminal text-grey-custom dark:text-brand-accent hover:text-brand-accent hover:underline uppercase tracking-wider font-bold transition-colors"
              >
                [ Request New Operator Access ]
              </Link>
            </div>
            <p className="text-[10px] font-terminal text-grey-custom dark:text-grey-custom-dark/40 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
