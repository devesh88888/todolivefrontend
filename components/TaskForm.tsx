'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function TaskForm({ task }: { task?: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: task?.title || '',
    status: task?.status || 'pending',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      router.push('/tasks');
    } catch {
      alert('Failed to submit');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" className="input" placeholder="Task title" required value={form.title} onChange={handleChange} />
      <select name="status" className="input" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button className="btn" type="submit">{task ? 'Update' : 'Create'} Task</button>
    </form>
  );
}
