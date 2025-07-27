'use client';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5050');

export default function TaskItem({ task, onDelete }: any) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/tasks/${task._id}`);
        socket.emit('deleteTask', {
          listId: task.listId,       // ✅ Required for room-based emit
          taskId: task._id,
        });
        onDelete(); // Update local state
      } catch (err) {
        alert('Failed to delete task');
        console.error(err);
      }
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
