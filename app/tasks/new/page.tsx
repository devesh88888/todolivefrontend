// /app/tasks/new/page.tsx
'use client';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
  return (
    <main className="max-w-xl mx-auto py-6">
      <h1 className="text-xl font-bold mb-4">Create New Task</h1>
      <TaskForm />
    </main>
  );
}
