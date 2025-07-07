'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicScoreboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the canonical /stream page
    router.replace('/stream');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold">Redirigiendo...</h1>
        <p className="text-muted-foreground mt-2">
          Serás redirigido a la página principal del marcador.
        </p>
      </div>
    </div>
  );
}
