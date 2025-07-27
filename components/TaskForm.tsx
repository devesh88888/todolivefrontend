'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import socket from '@/lib/socket'; // shared instance

export default function TaskForm({ task }: { task?: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: task?.title || '',
    status: task?.status || 'pending',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (task) {
        const res = await api.put(`/tasks/${task._id}`, form);
        socket.emit('updateTask', res.data.data);
      } else {
        const res = await api.post('/tasks', form);
        socket.emit('createTask', res.data.data);
      }

      router.push('/tasks');
    } catch (err: any) {
      console.error('Task submission error:', err.response?.data || err.message || err);
      alert('Failed to submit. Check the console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        className="input"
        placeholder="Task title"
        required
        value={form.title}
        onChange={handleChange}
      />
      <select
        name="status"
        className="input"
        value={form.status}
        onChange={handleChange}
      >
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : task ? 'Update' : 'Create'} Task
      </button>
    </form>
  );
}
