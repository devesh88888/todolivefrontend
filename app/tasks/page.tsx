'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TaskItem from '@/components/TaskItem';
import api from '@/lib/api';
import { logout } from '@/lib/auth';
import socket from '@/lib/socket';

interface Task {
  _id: string;
  title: string;
  status: string;
  listId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface List {
  _id: string;
  name: string;
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [listName, setListName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const listId = searchParams.get('listId');

  useEffect(() => {
    if (!listId) {
      alert('Missing listId in URL');
      router.push('/lists');
      return;
    }

    const fetchListAndTasks = async () => {
      try {
        // 🧾 Fetch list name
        const listRes = await api.get(`/lists/${listId}`);
        setListName(listRes.data.data.name);

        // 📦 Fetch tasks
        const res = await api.get('/tasks');
        const filtered = res.data.data.filter((t: Task) => t.listId === listId);
        setTasks(filtered);
      } catch (err: any) {
        console.error('Error fetching list or tasks:', err);
        alert('Unauthorized or failed to load tasks');
        logout();
        router.push('/login');
      }
    };

    fetchListAndTasks();

    socket.emit('joinList', listId);

    socket.on('taskCreated', (newTask: Task) => {
      if (newTask.listId === listId) {
        setTasks(prev => [...prev, newTask]);
      }
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      if (updatedTask.listId === listId) {
        setTasks(prev =>
          prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    });

    socket.on('taskDeleted', (deletedTaskId: string) => {
      setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
    });

    return () => {
      socket.emit('leaveList', listId);
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [listId]);

  if (!listId) return null;

  return (
    <main className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Tasks for List: <span className="text-blue-600">{listName}</span>
        </h1>
        <button
          className="btn"
          onClick={() => router.push(`/tasks/new?listId=${listId}`)}
        >
          + New Task
        </button>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found in this list.</p>
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
