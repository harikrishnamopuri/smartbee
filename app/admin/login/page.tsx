"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        try {
          localStorage.setItem('devAdmin', 'true');
          localStorage.setItem('devAdminEmail', data.email || email);
          // Store a fake admin token for dev environment
          localStorage.setItem('adminToken', 'dev-admin-token');
        } catch (e) {
          // ignore
        }
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 hero-accent">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐝</div>
            <div>
              <h1 className="text-white text-xl font-bold">Admin Login</h1>
              <p className="text-white text-sm opacity-90">Developer sign-in (local)</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Use development admin credentials to sign in locally.</p>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@company.com"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 px-3 py-2 shadow-sm focus:border-honey focus:ring-2 focus:ring-honey/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 px-3 py-2 shadow-sm focus:border-honey focus:ring-2 focus:ring-honey/30"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="px-4 py-2 btn-honey rounded-md hover:opacity-95" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <a href="/" className="text-sm text-gray-600 hover:underline">Back to site</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
