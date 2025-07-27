'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface List {
  _id: string;
  name: string;
  createdBy: string;
  members: string[];
  createdAt: string;
}

export default function ListsPage() {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await api.get('/lists');
        setLists(res.data.data);
      } catch (err) {
        console.error('Failed to fetch lists', err);
        alert('Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const members = memberEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    try {
      const res = await api.post('/lists', {
        name: newListName,
        members,
      });

      setLists(prev => [res.data.data, ...prev]);
      setNewListName('');
      setMemberEmails('');
    } catch (err) {
      console.error('Create list error:', err);
      alert('Failed to create list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this list?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/lists/${listId}`);
      setLists(prev => prev.filter(list => list._id !== listId));
    } catch (err) {
      console.error('Delete list error:', err);
      alert('Failed to delete list');
    }
  };

  const goToTasks = (listId: string) => {
    router.push(`/tasks?listId=${listId}`);
  };

  return (
    <main className="max-w-2xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Lists</h1>

      <form onSubmit={handleCreateList} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          className="input"
          placeholder="List name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Comma-separated member emails (optional)"
          value={memberEmails}
          onChange={(e) => setMemberEmails(e.target.value)}
        />
        <button className="btn w-full" type="submit">Create List</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : lists.length === 0 ? (
        <p>No lists found.</p>
      ) : (
        <ul className="space-y-4">
          {lists.map(list => (
            <li
              key={list._id}
              className="border p-4 rounded flex justify-between items-center hover:bg-gray-50"
            >
              <div className="cursor-pointer" onClick={() => goToTasks(list._id)}>
                <h2 className="font-semibold">{list.name}</h2>
                <p className="text-sm text-gray-500">
                  Members: {list.members.length} | Created: {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteList(list._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
