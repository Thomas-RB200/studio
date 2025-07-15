'use client';

import { useScoreboard } from '@/context/ScoreboardContext';
import Scoreboard from '@/components/scoreboard';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';


export default function OverlayPage() {
  const params = useParams() as { courtId: string };
  const { scoreboards, pointValues, theme, isInitialized } = useScoreboard();

  // This effect will run only on the client, after hydration, to avoid mismatches.
  useEffect(() => {
    // Add a specific class to the body when the overlay is active
    document.body.classList.add('overlay-active');

    // Return a cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('overlay-active');
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

 const [currentScoreboard, setCurrentScoreboard] = useState(scoreboards.find(sb => sb.id === params.courtId));

  // New Effect for WebSocket connection and event listening
  useEffect(() => {
    const socket = io('http://localhost:3001'); // Replace with your server URL if different

    socket.on('connect', () => {
      console.log('Overlay conectado al servidor WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Overlay desconectado del servidor WebSocket');
    });

    socket.on('marcadorActualizado', (updatedScoreboards) => { // Assuming array of scoreboards is received
      console.log('Actualización de marcador recibida en Overlay:', updatedScoreboards);
      const updatedThisScoreboard = updatedScoreboards.find(sb => sb.id === params.courtId);
      if (updatedThisScoreboard) {
         setCurrentScoreboard(updatedThisScoreboard);
      }
    });

  // Wait for the context to be initialized on the client to prevent hydration errors
  if (!isInitialized) {
    return null;
  }

  const scoreboard = scoreboards.find(sb => sb.id === params.courtId);
    return () => {
      socket.disconnect();
    };
  }, [params.courtId]); // Dependency on courtId

  if (!currentScoreboard || !currentScoreboard.isActive) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="rounded-lg bg-card p-4 text-center text-card-foreground">
          Scoreboard not found or is inactive.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
            <Scoreboard
                teams={currentScoreboard.teams}
                score={currentScoreboard.score}
                pointValues={pointValues}
                timers={currentScoreboard.timers}
                theme={theme}
                isReadOnly={true}
                isOverlay={true}
                servingTeam={currentScoreboard.servingTeam}
                tournamentName={currentScoreboard.tournamentName}
                matchName={currentScoreboard.matchName}
            />
        </div>
    </div>
  );
}
