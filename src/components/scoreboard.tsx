'use client';

import type { Theme, TimerState, Scoreboard as ScoreboardData, SetScore } from '@/lib/types';
import { Clock, Timer as TimerIcon, Dumbbell } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// This component handles all timer logic and rendering
const DynamicTimerDisplay = ({ timers }: { timers: TimerState }) => {
    const [isClient, setIsClient] = useState(false);
    const [now, setNow] = useState(0);

    useEffect(() => {
        setIsClient(true);
        setNow(Date.now()); // Initialize time on mount

        const timerId = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    // On the server, and on the client's first render, isClient will be false.
    if (!isClient) {
        // Render a static placeholder that is identical on server and client.
        return (
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-lg font-mono">00:00</span>
                <span className="text-xs uppercase font-semibold text-primary">TIEMPO DE PARTIDO</span>
            </div>
        );
    }

    const isCountdownActive = timers.activeCountdown.type && timers.activeCountdown.endTime && timers.activeCountdown.endTime > now;

    if (isCountdownActive) {
        const remainingSeconds = (timers.activeCountdown.endTime! - now) / 1000;
        const Icon = timers.activeCountdown.type === 'serve' ? TimerIcon : Dumbbell;
        const label = timers.activeCountdown.type === 'serve' ? 'TIEMPO DE SAQUE' : 'CALENTAMIENTO';
        
        return (
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-lg font-mono text-accent">{formatTime(remainingSeconds)}</span>
                <span className="text-xs uppercase font-semibold text-primary">{label}</span>
            </div>
        );
    }

    // Default: Show main game timer
    let totalSeconds = timers.accumulatedTime;
    if (timers.isGameRunning && timers.gameStartTime) {
        totalSeconds += (now - timers.gameStartTime) / 1000;
    }

    return (
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-lg font-mono">{formatTime(totalSeconds)}</span>
            <span className="text-xs uppercase font-semibold text-primary">TIEMPO DE PARTIDO</span>
        </div>
    );
};


const Scoreboard = ({
  teams,
  score,
  pointValues,
  timers,
  theme,
  servingTeam,
  tournamentName,
  matchName,
  isOverlay = false,
}: {
  teams: { teamA: string; teamB: string };
  score: ScoreboardData['score'];
  pointValues: string[];
  timers: TimerState;
  theme: Theme;
  isReadOnly?: boolean;
  isOverlay?: boolean;
  servingTeam: 'teamA' | 'teamB' | null;
  tournamentName?: string;
  matchName?: string;
}) => {
  
  const numSetCols = Math.min(score.sets.length + 1, 3);
  const gridTemplateColumns = `2fr ${'1fr '.repeat(numSetCols)} 1fr 1fr`;

  const teamASets = score.sets?.map(s => s.teamA) || [];
  const teamBSets = score.sets?.map(s => s.teamB) || [];
  
  const renderTeamRow = (
    teamName: string, 
    teamScore: { points: number; games: number; }, 
    teamSetScores: number[], 
    isServing: boolean
  ) => {
    return (
      <div className="grid grid-cols-subgrid col-span-full items-center bg-card">
        <div className="p-3 flex items-center gap-2">
          {isServing && <div className="w-2.5 h-2.5 bg-accent rounded-full" title="Serving"></div>}
          <span className="font-bold uppercase text-card-foreground whitespace-nowrap">{teamName}</span>
        </div>
        
        {/* Dynamic Set Columns */}
        {Array.from({ length: numSetCols }).map((_, i) => (
            <div key={i} className="bg-card h-full flex items-center justify-center border-l border-background/50">
                <span className="text-4xl font-bold text-primary">{teamSetScores[i] ?? ''}</span>
            </div>
        ))}

        {/* Games Column */}
        <div className="bg-card h-full flex items-center justify-center border-l border-background/50">
          <span className="text-4xl font-bold text-card-foreground">{teamScore.games}</span>
        </div>
        {/* Points Column */}
        <div className="bg-accent text-accent-foreground h-full flex items-center justify-center border-l border-background/50">
          <span className="text-4xl font-bold">{pointValues[teamScore.points]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "font-sans text-foreground w-full max-w-4xl mx-auto",
      isOverlay ? "bg-transparent" : "bg-card/80 p-2 sm:p-4 rounded-lg border border-border"
    )}>

      <div className="flex justify-between items-center mb-2 px-2 text-xs sm:text-sm">
        <p className="font-bold uppercase">{tournamentName || theme.tournamentName || 'Torneo'}</p>
        <p className="font-bold uppercase">{matchName || theme.matchName || 'Partido'}</p>
      </div>
      
      <div className="bg-foreground/20 p-px grid gap-px" style={{ gridTemplateColumns }}>
        {/* Headers */}
        <div className="p-2 text-xs font-semibold text-foreground/80 uppercase">Pareja</div>
        
        {/* Dynamic Set Headers */}
        {Array.from({ length: numSetCols }).map((_, i) => (
            <div key={i} className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">{`SET ${i + 1}`}</div>
        ))}
        
        <div className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">Juegos</div>
        <div className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">Puntos</div>
        
        {/* Team Rows */}
        {renderTeamRow(teams.teamA, score.teamA, teamASets, servingTeam === 'teamA')}
        {renderTeamRow(teams.teamB, score.teamB, teamBSets, servingTeam === 'teamB')}
      </div>

       <div className="flex justify-between items-center mt-2 px-2">
         <DynamicTimerDisplay timers={timers} />
       </div>
    </div>
  );
};
export default Scoreboard;
