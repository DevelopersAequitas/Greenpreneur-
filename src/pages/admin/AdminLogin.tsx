import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProduction ? '/api/admin/login' : `http://${window.location.hostname}:5000/api/admin/login`;

    // Debug logs
    console.log('[DEBUG] Login API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('[DEBUG] Response status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('Server error. Please try again later.');
      }

      console.log('[DEBUG] Data success:', data ? data.success : undefined);

      if (!response.ok || !data || !data.success) {
        if (response.status === 401) {
          throw new Error(data?.message || 'Invalid email or password');
        } else {
          throw new Error(data?.message || 'Server error. Please try again later.');
        }
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('[DEBUG] Login error:', err);
      if (err.message && err.message !== 'Failed to fetch') {
        setError(err.message);
      } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Unable to connect to server');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/60 text-sm">Sign in to manage submissions and data.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-start text-red-200">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="admin@greenpreneur.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-green-950 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
