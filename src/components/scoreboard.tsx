'use client';

import type { Theme, TimerState, Scoreboard as ScoreboardData, SetScore } from '@/lib/types';
import { Clock, Timer as TimerIcon, Dumbbell } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// This component handles all timer logic and rendering
const DynamicTimerDisplay = ({ timers }: { timers: TimerState }) => {
    const [now, setNow] = useState(0);

    useEffect(() => {
        // Set initial time on mount (client-side only)
        setNow(Date.now());

        const timerId = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    // Helper to format seconds into HH:MM:SS or MM:SS
    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    // On the server or before the first client-side render, show a static time.
    if (now === 0) {
        return (
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-lg font-mono">{formatTime(timers.accumulatedTime)}</span>
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
  servingTeam,
  isOverlay = false,
}: {
  teams: { teamA: string; teamB: string };
  score: ScoreboardData['score'];
  pointValues: string[];
  timers: TimerState;
  theme: Theme; // Keep theme for potential future use or overlay styling
  isReadOnly?: boolean;
  isOverlay?: boolean;
  servingTeam: 'teamA' | 'teamB' | null;
}) => {
  
  const teamASets = score.sets?.map(s => s.teamA) || [];
  const teamBSets = score.sets?.map(s => s.teamB) || [];

  // Always show at least 2 set columns, add more if needed
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
      <div className="grid grid-cols-subgrid col-span-full items-center bg-card">
        <div className="p-3">
          <div className="flex items-center gap-2">
             {isServing && <div className="w-2.5 h-2.5 bg-accent rounded-full" title="Serving"></div>}
            <span className="font-bold uppercase text-card-foreground">{player1}</span>
          </div>
          {player2 && <span className="font-bold uppercase text-card-foreground ml-5">{player2}</span>}
        </div>
        {Array.from({ length: setHeaderCount }).map((_, i) => (
          <div key={`set-${i}`} className="bg-card h-full flex items-center justify-center border-l border-background/50">
            <span className="text-4xl font-bold text-primary">{teamSetScores[i] ?? ''}</span>
          </div>
        ))}
        <div className="bg-card h-full flex items-center justify-center border-l border-background/50">
          <span className="text-4xl font-bold text-card-foreground">{teamScore.games}</span>
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
      isOverlay ? "bg-transparent" : "bg-card/80 p-2 sm:p-4 rounded-lg border border-border"
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
