'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import TaskForm from '@/components/TaskForm';

export default function EditTaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await api.get('/tasks');
      const found = res.data.data.find((t: any) => t._id === id);
      setTask(found);
    };
    fetchTask();
  }, [id]);

  if (!task) return <p>Loading...</p>;

  return (
    <main className="max-w-xl mx-auto py-6">
      <h1 className="text-xl font-bold mb-4">Edit Task</h1>
      <TaskForm task={task} />
    </main>
  );
}
