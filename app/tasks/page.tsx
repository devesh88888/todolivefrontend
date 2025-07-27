import { Suspense } from 'react';
import TaskListClient from './TaskListClient';

export default function TasksPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading tasks...</p>}>
      <TaskListClient />
    </Suspense>
  );
}
