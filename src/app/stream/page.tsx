import { Suspense } from 'react';
import StreamPageClient from './client';

export default function StreamPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <StreamPageClient />
    </Suspense>
  );
}
