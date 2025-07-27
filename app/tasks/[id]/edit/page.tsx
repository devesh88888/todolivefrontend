'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import TaskForm from '@/components/TaskForm';

interface Task {
  _id: string;
  title: string;
  status: string;
  listId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditTaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data.data);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError('Task not found or access denied.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!task) return <p className="text-gray-500">No task found.</p>;

  return (
    <main className="max-w-xl mx-auto py-6">
      <h1 className="text-xl font-bold mb-4">Edit Task</h1>
      {/* ✅ Pass full task object to preserve listId */}
      <TaskForm task={task} />
    </main>
  );
}
