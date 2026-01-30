
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { Building2, Lock, Mail, AlertCircle, Loader2, Info, ExternalLink } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useData();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white">Staff Access</h1>
          <p className="text-gray-400 mt-2">Authenticated Infrastructure Node</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Identifier</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@asgharbuilders.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 text-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Security Token</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 text-white transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <AlertCircle size={16} className="shrink-0" />
                <span className="font-bold">Error: {error}</span>
              </div>
              
              <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  <Info size={14} className="shrink-0" />
                  <span>Troubleshooting</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed italic">
                  Check your API keys in index.html. Ensure the key starts with eyJ and that your storage bucket is named "projects".
                </p>
                <a 
                  href="https://supabase.com/dashboard" 
                  target="_blank" 
                  className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-[10px] font-bold"
                >
                  <span>Go to Supabase Dashboard</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            <span>{loading ? 'Authenticating...' : 'Enter Console'}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-gray-500 text-sm hover:text-white transition-colors">
            Return to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
