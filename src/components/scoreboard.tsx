'use client';

import type { Theme, TimerState } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Clock, Dumbbell, Timer as TimerIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ScoreboardProps {
  teams: { teamA: string; teamB: string };
  score: {
    teamA: { points: number; games: number; sets: number };
    teamB: { points: number; games: number; sets: number };
  };
  pointValues: string[];
  timers: TimerState;
  theme: Theme;
  isReadOnly?: boolean;
  isOverlay?: boolean;
  compact?: boolean;
}

const formatTime = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const DynamicTimerDisplay = ({ timers, theme, isOverlay = false }: { timers: TimerState; theme: Theme; isOverlay?: boolean }) => {
  const [now, setNow] = useState(0);

  useEffect(() => {
    // Set the initial time on the client to start the timer
    setNow(Date.now());
    
    // Set up the interval to update the time every second
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // --- Static Calculation for Server-Side Rendering ---
  // If `now` is 0, it means we're on the server or in the very first client render before useEffect runs.
  // In this case, we show a static, non-ticking time to prevent hydration mismatch.
  if (now === 0) {
    const staticTime = formatTime(timers.accumulatedTime);
    const overlayTextStyle = isOverlay ? { textShadow: '1px 1px 2px rgba(0,0,0,0.7)' } : {};
    const overlayIconStyle = isOverlay ? { filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' } : {};
    return (
      <div className="flex items-baseline gap-2">
        <Clock className="h-4 w-4" style={{ ...overlayIconStyle, color: theme.textColor }} />
        <span className="text-lg font-bold font-mono" style={{ ...overlayTextStyle, color: theme.textColor }}>{staticTime}</span>
      </div>
    );
  }

  // --- Live Calculation for Client-Side Rendering ---
  let displayValue: string;
  let displayLabel = '';
  let displayIcon: React.ElementType = Clock;
  let timeColor = theme.textColor;

  let gameSeconds = timers.accumulatedTime;
  if (timers.isGameRunning && timers.gameStartTime) {
    gameSeconds += (now - timers.gameStartTime) / 1000;
  }
  const gameTimeValue = formatTime(gameSeconds);

  const isCountdownActive = timers.activeCountdown.type && timers.activeCountdown.endTime && timers.activeCountdown.endTime > now;

  if (isCountdownActive) {
    const remainingSeconds = Math.ceil((timers.activeCountdown.endTime! - now) / 1000);
    displayValue = formatTime(remainingSeconds);
    if (timers.activeCountdown.type === 'serve') {
      displayLabel = 'Serve Time';
      displayIcon = TimerIcon;
      timeColor = '#f59e0b'; // amber-500
    } else { // warmup
      displayLabel = 'Warm-up';
      displayIcon = Dumbbell;
      timeColor = '#3b82f6'; // blue-500
    }
  } else {
    displayValue = gameTimeValue;
  }

  const Icon = displayIcon;
  const overlayTextStyle = isOverlay ? { textShadow: '1px 1px 2px rgba(0,0,0,0.7)' } : {};
  const overlayIconStyle = isOverlay ? { filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' } : {};
  
  return (
     <div className="flex items-baseline gap-2">
        <Icon className="h-4 w-4" style={{ ...overlayIconStyle, color: theme.textColor }} />
        <span className="text-lg font-bold font-mono" style={{ ...overlayTextStyle, color: timeColor }}>{displayValue}</span>
        {displayLabel && <span className="text-sm uppercase tracking-wider" style={{ ...overlayTextStyle, color: theme.textColor }}>{displayLabel}</span>}
    </div>
  );
};


const Scoreboard = ({
  teams,
  score,
  pointValues,
  timers,
  theme,
  isReadOnly = false,
  isOverlay = false,
  compact = false,
}: ScoreboardProps) => {
  const overlayTextStyle = isOverlay ? { textShadow: '2px 2px 3px rgba(0,0,0,0.8)' } : {};
  
  return (
      <Card className={cn("w-full", isOverlay ? "shadow-none border-none bg-transparent" : "shadow-lg border bg-card")}>
          <CardContent className={cn("p-0", isOverlay && "bg-card/90 rounded-lg")}>
              <Table>
                  <TableBody>
                      {[
                          { name: teams.teamA, score: score.teamA, key: 'teamA' as const },
                          { name: teams.teamB, score: score.teamB, key: 'teamB' as const }
                          
                      ].map((team) => (
                          <TableRow key={team.key} className="border-b-0 hover:bg-transparent">
                              <TableCell className={cn(
                                "font-bold truncate text-primary",
                                compact ? "text-base md:text-lg py-2 px-1" : "text-xl md:text-2xl py-3 px-2"
                              )} style={{...overlayTextStyle, color: isOverlay ? theme.primaryColor : ''}}>{team.name}</TableCell>
                              <TableCell className={cn(
                                "text-center font-bold text-accent",
                                compact ? "text-lg md:text-xl p-2" : "text-2xl md:text-4xl p-3"
                              )} style={{...overlayTextStyle, color: isOverlay ? theme.accentColor : ''}}>{pointValues[team.score.points]}</TableCell>
                              <TableCell className={cn(
                                "text-center font-bold text-accent",
                                compact ? "text-lg md:text-xl p-2" : "text-2xl md:text-4xl p-3"
                              )} style={{...overlayTextStyle, color: isOverlay ? theme.accentColor : ''}}>{team.score.games}</TableCell>
                              <TableCell className={cn(
                                "text-center font-bold text-accent",
                                compact ? "text-lg md:text-xl p-2" : "text-2xl md:text-4xl p-3"
                              )} style={{...overlayTextStyle, color: isOverlay ? theme.accentColor : ''}}>{team.score.sets}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
           <Separator className={cn(compact ? 'mx-2' : 'mx-4', isOverlay && "bg-white/30")} />
           <CardContent className={cn("p-0 flex", isOverlay && "bg-card/90 rounded-lg")}>
             <div className={cn("w-full", compact ? "px-2 py-1" : "px-4 py-2")}>
                <DynamicTimerDisplay timers={timers} theme={theme} isOverlay={isOverlay} />
             </div>
          </CardContent>
      </Card>
  );
}

export default Scoreboard;
