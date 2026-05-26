import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import axios from "axios";
import type { RegisterRequest } from "../types/auth";
import Navbar from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, lastName, email, password, confirmPassword } = formData;

    if (password.length < 8) {
      setError("PASSWORD MUST BE AT LEAST 8 CHARACTERS");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("ACCESS KEYS DO NOT MATCH");
      setLoading(false);
      return;
    }

    try {
      const requestData: RegisterRequest = { name, lastName, email, password };
      await authService.register(requestData);

      navigate("/login", {
        state: { message: "REGISTRATION SUCCESSFUL. INITIATE AUTHENTICATION." },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        let backendMessage = "REGISTRATION CRASHED";

        if (data) {
          if (typeof data === "string") {
            backendMessage = data;
          } else if (data.message) {
            backendMessage = data.message;
          } else if (data.error) {
            backendMessage = data.error;
          }
        }

        setError(backendMessage.toUpperCase());
      } else {
        setError("TERMINAL CONNECTION ERROR");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-bg-main-light dark:bg-bg-main-dark pt-20 p-4 font-main">
        <div className="w-full max-w-lg bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-in">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>

            <h1 className="text-title-main font-title text-black dark:text-white tracking-wider uppercase">
              Terminal <span className="text-brand-accent">Register</span>
            </h1>
            <p className="text-xs font-terminal text-grey-custom dark:text-grey-custom-dark mt-2 italic uppercase tracking-widest">
              Create New Operator Profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                label="First Name"
                type="text"
                name="name"
                placeholder="John"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="System Email"
              type="email"
              name="email"
              placeholder="developer@system.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                label="Access Key"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                label="Confirm Key"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

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
                {loading ? "PROCESSING..." : "INITIALIZE PROFILE"}
              </Button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-terminal-sm font-terminal text-2xl hover:text-brand-accent dark:text-brand-accent hover:underline uppercase tracking-wider font-bold transition-colors"
            >
              [ Return to Authentication Terminal ]
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
