import { Suspense } from 'react';
import NewTaskClient from './NewTaskClient';

export default function NewTaskPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <NewTaskClient />
    </Suspense>
  );
}