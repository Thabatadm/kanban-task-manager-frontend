import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Navbar from '../components/layout/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      
      contextLogin(response.token, { 
        name: response.name, 
        lastName: response.lastName 
      });

      navigate('/dashboard');
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Invalid Credentials';
        setError(message);
      } else {
        setError('Connection error with terminal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-bg-main-light dark:bg-bg-main-dark p-4">
        <div className="w-full max-w-md bg-bg-card-light dark:bg-bg-card-dark border border-border-terminal rounded-3xl p-10 shadow-[0_20px_50px_rgba(79,70,229,0.08)]">
          
          <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-2xl bg-brand-accent mb-4 shadow-xl shadow-brand-accent/20">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-weight-title text-black dark:text-white tracking-tighter uppercase">
              Kanban <span className="text-brand-accent">Flow</span>
            </h1>
            <p className="text-subtitle font-weight-body text-slate-500 dark:text-slate-400 mt-2 italic">
              Secure Terminal Access
            </p>
          </div>

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
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-terminal-sm rounded-xl text-center font-bold animate-pulse uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={loading} 
                className="w-full py-6 text-lg font-weight-title tracking-widest uppercase shadow-lg shadow-brand-accent/10"
              >
                {loading ? 'VERIFYING...' : 'AUTHENTICATE'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-500 text-terminal-sm font-bold uppercase tracking-tighter">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;