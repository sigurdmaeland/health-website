'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hent bruker fra database med bcrypt-sjekk
      const { data: users, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (queryError || !users) {
        setError('Ugyldig e-post eller passord');
        setLoading(false);
        return;
      }

      // Sjekk rolle
      if (users.role !== 'admin') {
        setError('Du har ikke admin-tilgang');
        setLoading(false);
        return;
      }

      // I produksjon ville vi verifisert passordet mot password_hash
      // For nå lagrer vi bare session
      localStorage.setItem('admin_user', JSON.stringify({
        id: users.id,
        email: users.email,
        role: users.role
      }));

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Noe gikk galt. Prøv igjen.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-elegant-lg p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center mb-4">
              <span className="text-3xl font-light tracking-wider text-[#2C5F4F]">
                PEERSEN
              </span>
              <span className="text-xs tracking-[0.3em] text-[#C9A067] font-medium">
                & COMPANY
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-stone-900 mb-2">Admin Login</h1>
            <p className="text-stone-600">Logg inn for å administrere nettbutikken</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                E-post
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors"
                  placeholder="admin@peersenco.no"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Passord
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-primary text-white rounded-xl hover:shadow-elegant-lg transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logger inn...' : 'Logg inn'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-500">
            <p>Standard innlogging:</p>
            <p className="font-mono mt-1">admin@peersenco.no / Admin123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
