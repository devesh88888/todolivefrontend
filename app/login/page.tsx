'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      router.push('/tasks');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Live Collaborative To-Do List
      </h1>

      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn w-full">Login</button>

        <div className="text-center text-sm text-gray-600">
          Not registered?
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:underline ml-1"
          >
            Create an account
          </button>
        </div>
      </form>
    </main>
  );
}

