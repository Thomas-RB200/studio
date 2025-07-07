'use client';

import type { Theme, TimerState, Scoreboard as ScoreboardData } from '@/lib/types';
import { Clock } from 'lucide-react';
import React from 'react';
import { cn } from "@/lib/utils";

const ScoreBox = ({ value, type, isOverlay }: { value: string | number, type: 'set' | 'points', isOverlay: boolean }) => {
  const overlayTextStyle = isOverlay ? { textShadow: '1px 1px 2px rgba(0,0,0,0.7)' } : {};
  const boxClass = type === 'set' ? 'bg-primary' : 'bg-accent text-accent-foreground';
  
  return (
    <div className={cn(
      "flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16",
      boxClass
    )}>
      <span className="text-3xl sm:text-4xl font-bold" style={overlayTextStyle}>
        {value}
      </span>
    </div>
  );
};

const TeamRow = ({
  team,
  isServing,
  pointValues,
  setScores,
  maxSets,
}: {
  team: { name: string, score: { points: number, games: number }},
  isServing: boolean,
  pointValues: string[],
  setScores: number[],
  maxSets: number,
}) => {
  const [player1, player2] = team.name.split(' / ').map(p => p.trim());
  const setsToDisplay = [...setScores];
  while (setsToDisplay.length < maxSets) {
    setsToDisplay.push(0);
  }

  return (
    <div className="grid grid-cols-[2fr,repeat(4,1fr)] bg-background items-center">
      {/* Names */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase text-foreground">{player1}</span>
          {isServing && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
        </div>
        {player2 && <span className="font-bold uppercase text-foreground">{player2}</span>}
      </div>

      {/* Set Scores */}
      {setsToDisplay.map((setScore, i) => (
        <div key={i} className="bg-primary h-full flex items-center justify-center border-l border-background">
          <span className="text-4xl font-bold text-primary-foreground">{setScore}</span>
        </div>
      ))}

      {/* Current Game */}
       <div className="bg-primary h-full flex items-center justify-center border-l border-background">
          <span className="text-4xl font-bold text-primary-foreground">{team.score.games}</span>
        </div>

      {/* Points */}
      <div className="bg-accent text-accent-foreground h-full flex items-center justify-center border-l border-background">
        <span className="text-4xl font-bold">{pointValues[team.score.points]}</span>
      </div>
    </div>
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

  const teamAData = { name: teams.teamA, score: score.teamA };
  const teamBData = { name: teams.teamB, score: score.teamB };
  const teamASets = score.sets?.map(s => s.teamA) || [];
  const teamBSets = score.sets?.map(s => s.teamB) || [];

  const setHeaderCount = Math.max(2, score.sets?.length || 0);

  return (
    <div className={cn(
      "font-sans text-foreground w-full max-w-3xl mx-auto",
      isOverlay ? "bg-transparent" : "bg-background/50 p-2 sm:p-4 rounded-lg"
    )}>

      <div className="flex justify-between items-center mb-2 px-2 text-xs sm:text-sm">
        <p className="font-bold uppercase">World Padel Tour</p>
        <p className="font-bold uppercase">Victoria</p>
      </div>
      
      <div className="bg-foreground/20 p-px grid gap-px">
        <div className="grid grid-cols-[2fr,repeat(4,1fr)] items-center">
            <div className="p-2 text-xs font-semibold text-foreground/80 uppercase">Pareja</div>
            {Array.from({ length: setHeaderCount }).map((_, i) => (
              <div key={i} className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">SET {i + 1}</div>
            ))}
             <div className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">Juegos</div>
            <div className="p-2 text-center text-xs font-semibold text-foreground/80 uppercase">Puntos</div>
        </div>
        <TeamRow team={teamAData} isServing={isTeamAServing} pointValues={pointValues} setScores={teamASets} maxSets={setHeaderCount} />
        <TeamRow team={teamBData} isServing={!isTeamAServing} pointValues={pointValues} setScores={teamBSets} maxSets={setHeaderCount} />
      </div>

       <div className="flex justify-between items-center mt-2 px-2">
         <div className="flex items-center gap-2">
            <span className="text-lg font-mono">{new Date(timers.accumulatedTime * 1000).toISOString().substr(14, 5)}</span>
            <span className="text-xs uppercase font-semibold text-primary">TIEMPO DE PARTIDO</span>
         </div>
       </div>
    </div>
  );
};
export default Scoreboard;
