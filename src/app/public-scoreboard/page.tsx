import { Suspense } from 'react';
import PublicScoreboardRedirect from './client';

export default function PublicScoreboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <PublicScoreboardRedirect />
    </Suspense>
  );
}
