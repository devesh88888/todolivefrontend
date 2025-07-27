'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      router.push('/tasks');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Live Collaborative To-Do List
      </h1>

      <form onSubmit={handleRegister} className="p-6 bg-white shadow-md rounded w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Register</h2>
        <input
          name="name"
          placeholder="Name"
          required
          className="input"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          className="input"
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          required
          className="input"
          onChange={handleChange}
        />
        <button type="submit" className="btn w-full">Register</button>

        <div className="text-center text-sm text-gray-600">
          Already registered?
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline ml-1"
          >
            Login here
          </button>
        </div>
      </form>
    </main>
  );
}
