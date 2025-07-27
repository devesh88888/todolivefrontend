'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import socket from '@/lib/socket';

interface Task {
  _id: string;
  title: string;
  status: string;
  listId: string;
}

interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function TaskForm({ task }: { task?: Task }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listIdParam = searchParams.get('listId');
  const listId = task?.listId || listIdParam;

  const [form, setForm] = useState({
    title: task?.title || '',
    status: task?.status || 'pending',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!task && !listId) {
      alert('Missing listId for new task.');
      router.push('/lists');
    }
  }, [task, listId, router]); // ✅ Include router in dependency array

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (task) {
        const res = await api.put(`/tasks/${task._id}`, form);
        socket.emit('updateTask', {
          listId: task.listId,
          task: res.data.data,
        });
        router.push(`/tasks?listId=${task.listId}`);
      } else {
        const res = await api.post('/tasks', { ...form, listId });
        socket.emit('createTask', {
          listId,
          task: res.data.data,
        });
        router.push(`/tasks?listId=${listId}`);
      }
    } catch (err: unknown) {
      const error = err as CustomError;
      console.error('Task submission error:', error.response?.data || error.message || error);
      alert(error.response?.data?.message || 'Failed to submit. Check the console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!listId && !task) return null;

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
