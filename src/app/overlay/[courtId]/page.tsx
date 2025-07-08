'use client';

import { useScoreboard } from '@/context/ScoreboardContext';
import Scoreboard from '@/components/scoreboard';

export default function OverlayPage({ params }: { params: { courtId: string } }) {
  const { scoreboards, pointValues, theme, isInitialized } = useScoreboard();

  // Wait for the context to be initialized on the client to prevent hydration errors
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="rounded-lg bg-card p-4 text-center text-card-foreground">
          Initializing Overlay...
        </div>
      </div>
    );
  }

  const scoreboard = scoreboards.find(sb => sb.id === params.courtId);

  if (!scoreboard || !scoreboard.isActive) {
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
                teams={scoreboard.teams}
                score={scoreboard.score}
                pointValues={pointValues}
                timers={scoreboard.timers}
                theme={theme}
                isReadOnly={true}
                isOverlay={true}
                servingTeam={scoreboard.servingTeam}
                tournamentName={scoreboard.tournamentName}
                matchName={scoreboard.matchName}
            />
        </div>
    </div>
  );
}
