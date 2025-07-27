'use client';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function TaskItem({ task, onDelete }: any) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await api.delete(`/tasks/${task._id}`);
      onDelete();
    }
  };

  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <h2 className="font-bold">{task.title}</h2>
        <p className="text-sm text-gray-600">Status: {task.status}</p>
      </div>
      <div className="space-x-2">
        <button onClick={() => router.push(`/tasks/${task._id}/edit`)} className="btn-sm">Edit</button>
        <button onClick={handleDelete} className="btn-sm bg-red-500">Delete</button>
      </div>
    </div>
  );
}
