'use client';
import TaskForm from '@/components/TaskForm';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewTaskClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listId = searchParams.get('listId');

  useEffect(() => {
    if (!listId) {
      alert('Missing listId in URL');
      router.push('/lists');
    }
  }, [listId, router]);

  if (!listId) return null;

  return (
    <main className="max-w-xl mx-auto py-6">
      <h1 className="text-xl font-bold mb-4">Create New Task</h1>
      <TaskForm />
    </main>
  );
}
