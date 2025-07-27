'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskItem from '@/components/TaskItem';
import api from '@/lib/api';
import { logout } from '@/lib/auth';
import socket from '@/lib/socket'; // ✅ Singleton socket instance

interface Task {
  _id: string;
  title: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data.data);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        alert('Unauthorized or failed to load tasks');
        logout();
        router.push('/login');
      }
    };

    fetchTasks();

    socket.on('taskCreated', (newTask: Task) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      setTasks(prev =>
        prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('taskDeleted', (deletedTaskId: string) => {
      setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <button className="btn" onClick={() => router.push('/tasks/new')}>
          + New Task
        </button>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={() => setTasks((prev) => prev.filter(t => t._id !== task._id))}
            />
          ))
        )}
      </div>
    </main>
  );
}
