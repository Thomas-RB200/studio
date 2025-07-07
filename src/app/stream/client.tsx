'use client';

import Scoreboard from '@/components/scoreboard';
import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay";
import ErrorBoundary from '@/components/error-boundary';
import type { GlobalState } from '@/lib/types';
import PublicThemeHandler from '@/components/public-theme-handler';


// IMPORTANT: These must match the values in ScoreboardContext.tsx
const LOCAL_STORAGE_KEY = 'padelScoreboardState_v11';
const REFRESH_INTERVAL_MS = 3000;

const pointValues = ['0', '15', '30', '40', 'AD'];

const StreamFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-destructive text-destructive-foreground">
    <div className="text-center">
      <h1 className="text-4xl font-bold">Error</h1>
      <p className="text-lg">Could not load the stream. An error has been reported.</p>
    </div>
  </div>
);

function StreamView() {
  const [liveData, setLiveData] = useState<GlobalState | null>(null);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true, loop: true }));
  const searchParams = useSearchParams();

  const syncState = useCallback(() => {
    try {
      const storedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedStateJSON) {
        setLiveData(JSON.parse(storedStateJSON));
      } else {
        setLiveData(null);
      }
    } catch (e) {
      console.error("Failed to sync state from localStorage", e);
      setLiveData(null);
    }
  }, []);

  useEffect(() => {
    syncState(); // Initial sync
    const intervalId = setInterval(syncState, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [syncState]);
  
  if (!liveData || !liveData.scoreboards || !liveData.theme || !liveData.ads) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-center p-4 rounded-lg bg-card border border-destructive max-w-md mx-auto">
                <h1 className="text-2xl font-bold">Esperando Datos</h1>
                <p className="text-muted-foreground mt-2">
                  La página de transmisión está esperando que un administrador inicie sesión y configure la aplicación. Los datos se mostrarán en cuanto estén disponibles.
                </p>
            </div>
        </div>
    );
  }
    
  const { scoreboards, theme, ads } = liveData;
  
  const overlayId = searchParams.get('id');
  const isOverlay = searchParams.get('overlay') === 'true';

  const scoreboardsToDisplay = isOverlay
    ? scoreboards.filter(sb => sb.id === overlayId && sb.isActive)
    : scoreboards.filter(sb => sb.isActive);
    
  const backgroundStyles = isOverlay 
  ? { backgroundColor: 'transparent' }
  : theme.backgroundType === 'image' && theme.backgroundImage
    ? { 
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : { backgroundColor: theme.backgroundColor };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicThemeHandler theme={theme} />
      <main
        className="flex-grow w-full flex flex-col transition-colors duration-500"
        style={backgroundStyles}
      >
        <div className="flex-grow p-4">
          {!isOverlay && (
            <h1 className="text-4xl font-bold text-center mb-4" style={{ color: theme.textColor }}>
              {theme.scoreboardTitle}
            </h1>
          )}
          
          {scoreboardsToDisplay.length === 0 ? (
            <p className="text-center text-lg col-span-full" style={{ color: theme.textColor }}>
              {isOverlay ? 'Scoreboard not found or is inactive.' : 'No active scoreboards.'}
            </p>
          ) : scoreboardsToDisplay.length === 1 ? (
             <div className="w-full h-full flex items-center justify-center p-4">
              <div className="w-full max-w-4xl">
                {scoreboardsToDisplay.map(sb => (
                  <div key={sb.id}>
                    <h2 className="text-2xl font-semibold text-center mb-2" style={{ color: theme.textColor }}>
                      {sb.courtName}
                    </h2>
                    <Scoreboard
                      teams={sb.teams}
                      score={sb.score}
                      pointValues={pointValues}
                      timers={sb.timers}
                      theme={theme}
                      isReadOnly={true}
                      isOverlay={isOverlay}
                      servingTeam={sb.servingTeam}
                      tournamentName={sb.tournamentName}
                      matchName={sb.matchName}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {scoreboardsToDisplay.map(sb => (
                <div key={sb.id} className="w-full rounded-lg transition-all">
                  <div className="flex justify-center items-baseline gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-center" style={{ color: theme.textColor }}>
                          {sb.courtName}
                      </h2>
                  </div>
                  <Scoreboard
                    teams={sb.teams}
                    score={sb.score}
                    pointValues={pointValues}
                    timers={sb.timers}
                    theme={theme}
                    isReadOnly={true}
                    isOverlay={isOverlay}
                    servingTeam={sb.servingTeam}
                    tournamentName={sb.tournamentName}
                    matchName={sb.matchName}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {!isOverlay && ads.length > 0 && (
         <div className="w-full h-24">
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {ads.map((ad) => (
                <CarouselItem key={ad.id} className="pl-0 basis-full">
                  <Card className="overflow-hidden bg-card rounded-none border-x-0 border-b-0 h-24">
                    <CardContent className="flex h-full items-center justify-between p-4">
                      <span className="text-xl font-bold" style={{ color: theme.textColor }}>
                        {ad.title}
                      </span>
                      {ad.imageUrl && <Image
                        src={ad.imageUrl}
                        alt={ad.title}
                        width={150}
                        height={60}
                        className="rounded-md object-contain"
                        data-ai-hint={ad['data-ai-hint']}
                      />}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}

export default function StreamPageClient() {
    return (
        <ErrorBoundary fallback={<StreamFallback />}>
            <StreamView />
        </ErrorBoundary>
    )
}
