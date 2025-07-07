'use client';

import type { Theme, TimerState, Scoreboard as ScoreboardData, SetScore } from '@/lib/types';
import { Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Timer logic to make it tick on the client.
const DynamicTimerDisplay = ({ timers }: { timers: TimerState }) => {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        // Set initial time on mount (client-side only)
        setCurrentTime(Date.now());

        const timerId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    // On the server or before the first client-side render, show a static time.
    if (currentTime === 0) {
        return <span className="text-lg font-mono">00:00</span>;
    }

    let totalSeconds = timers.accumulatedTime;
    if (timers.isGameRunning && timers.gameStartTime) {
        totalSeconds += (currentTime - timers.gameStartTime) / 1000;
    }

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    return (
        <span className="text-lg font-mono">{formatTime(totalSeconds)}</span>
    );
};


const Scoreboard = ({
  teams,
  score,
  pointValues,
  timers,
  isOverlay = false,
}: {
  teams: { teamA: string; teamB: string };
  score: ScoreboardData['score'];
  pointValues: string[];
  timers: TimerState;
  theme: Theme;
  isReadOnly?: boolean;
  isOverlay?: boolean;
  compact?: boolean;
}) => {
  
  const totalGamesPlayed = (score.sets?.reduce((total, set) => total + set.teamA + set.teamB, 0) || 0) + score.teamA.games + score.teamB.games;
  const isTeamAServing = totalGamesPlayed % 2 === 0;

  const teamASets = score.sets?.map(s => s.teamA) || [];
  const teamBSets = score.sets?.map(s => s.teamB) || [];

  const setHeaderCount = Math.max(2, score.sets?.length || 0);
  
  const gridTemplateColumns = `2fr repeat(${setHeaderCount + 2}, 1fr)`;

  const renderTeamRow = (
    teamName: string, 
    teamScore: { points: number; games: number; }, 
    teamSetScores: number[], 
    isServing: boolean
  ) => {
    const [player1, player2] = teamName.split(' / ').map(p => p.trim());
    return (
      <div className="grid grid-cols-subgrid col-span-full items-center bg-background">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-foreground">{player1}</span>
            {isServing && <div className="w-2.5 h-2.5 bg-accent rounded-full" title="Serving"></div>}
          </div>
          {player2 && <span className="font-bold uppercase text-foreground">{player2}</span>}
        </div>
        {Array.from({ length: setHeaderCount }).map((_, i) => (
          <div key={`set-${i}`} className="bg-primary h-full flex items-center justify-center border-l border-background/50">
            <span className="text-4xl font-bold text-primary-foreground">{teamSetScores[i] ?? ''}</span>
          </div>
        ))}
        <div className="bg-primary h-full flex items-center justify-center border-l border-background/50">
          <span className="text-4xl font-bold text-primary-foreground">{teamScore.games}</span>
        </div>
        <div className="bg-accent text-accent-foreground h-full flex items-center justify-center border-l border-background/50">
          <span className="text-4xl font-bold">{pointValues[teamScore.points]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "font-sans text-foreground w-full max-w-4xl mx-auto",
      isOverlay ? "bg-transparent" : "bg-background/50 p-2 sm:p-4 rounded-lg"
    )}>

      <div className="flex justify-between items-center mb-2 px-2 text-xs sm:text-sm">
        <p className="font-bold uppercase">World Padel Tour</p>
        <p className="font-bold uppercase">Victoria</p>
      </div>
      
      <div className="bg-foreground/20 p-px grid gap-px" style={{ gridTemplateColumns }}>
        <div className="p-2 text-xs font-semibold text-foreground/80 uppercase">Pareja</div>
        {Array.from({ length: setHeaderCount }).map((_, i) => (
          <div key={`header-set-${i}`} className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">SET {i + 1}</div>
        ))}
        <div className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">Juegos</div>
        <div className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">Puntos</div>
        
        {renderTeamRow(teams.teamA, score.teamA, teamASets, isTeamAServing)}
        {renderTeamRow(teams.teamB, score.teamB, teamBSets, !isTeamAServing)}
      </div>

       <div className="flex justify-between items-center mt-2 px-2">
         <div className="flex items-center gap-2">
            <DynamicTimerDisplay timers={timers} />
            <span className="text-xs uppercase font-semibold text-primary">TIEMPO DE PARTIDO</span>
         </div>
       </div>
    </div>
  );
};
export default Scoreboard;
