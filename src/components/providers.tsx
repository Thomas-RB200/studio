'use client';

import { ScoreboardProvider } from '@/context/ScoreboardContext';
import type { ReactNode } from 'react';
import ThemeHandler from './theme-handler';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ScoreboardProvider>
      <ThemeHandler>{children}</ThemeHandler>
    </ScoreboardProvider>
  );
}
