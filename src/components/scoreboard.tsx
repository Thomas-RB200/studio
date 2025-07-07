import { Swords, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TeamState = {
  name: string;
  points: string;
  games: number;
  sets: number;
};

export type GameState = {
  courtName: string;
  team1: TeamState;
  team2: TeamState;
  isDeuce?: boolean;
  isOverlay?: boolean;
};

export function Scoreboard({ courtName, team1, team2, isDeuce, isOverlay = false }: GameState) {
  const PlayerRow = ({ name, sets, isServing }: { name: string, sets: number, isServing?: boolean }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isServing && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
        <span className="text-lg md:text-xl font-semibold truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: team1.sets > team2.sets ? team1.sets : team2.sets > 0 ? team2.sets : 1 }).map((_, i) => (
            <Trophy key={i} className={cn("w-5 h-5", sets > i ? 'text-primary' : 'text-muted-foreground/30')} />
        ))}
      </div>
    </div>
  );

  const ScoreDisplay = ({ points, games }: { points: string, games: number }) => (
    <div className="flex items-center justify-end gap-4 text-right">
      <span className="text-3xl md:text-4xl font-bold w-16">{games}</span>
      <span className={cn(
          "text-4xl md:text-5xl font-bold w-24",
          points === 'ADV' ? 'text-accent' : 'text-primary'
      )}>
        {points}
      </span>
    </div>
  );

  if (isOverlay) {
    return (
        <div className="bg-slate-900/80 text-white p-4 rounded-lg border-2 border-primary/50 shadow-2xl backdrop-blur-sm w-[450px]">
            <h2 className="text-center font-bold text-lg mb-2 text-primary tracking-wider uppercase">{courtName}</h2>
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{team1.name}</span>
                <span className="font-semibold text-lg">{team2.name}</span>
            </div>
            <div className="flex justify-between items-center font-mono text-5xl font-bold">
                <div className="flex gap-4">
                    <span>{team1.sets}</span>
                    <span>{team1.games}</span>
                </div>
                <span className="text-primary">{team1.points}</span>
                <Swords className="w-8 h-8 text-white/50" />
                <span className="text-primary">{team2.points}</span>
                <div className="flex gap-4">
                    <span>{team2.games}</span>
                    <span>{team2.sets}</span>
                </div>
            </div>
             {isDeuce && <p className="text-center mt-2 text-xl font-bold text-amber-300 animate-pulse">DEUCE</p>}
        </div>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-2">{courtName}</h3>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
            <p className="text-base font-semibold truncate text-left">{team1.name}</p>
            <Swords className="w-6 h-6 text-primary/80"/>
            <p className="text-base font-semibold truncate text-right">{team2.name}</p>
        </div>
        <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-4">
            <div className="grid grid-cols-[auto_auto] items-center justify-between">
                <div className="flex items-center gap-2">
                     {Array.from({ length: Math.max(1, team1.sets) }).map((_, i) => (
                        <Trophy key={i} className={cn("w-5 h-5", team1.sets > i ? 'text-primary' : 'text-muted-foreground/30')} />
                    ))}
                </div>
                <div className="flex items-center gap-2 justify-end">
                     {Array.from({ length: Math.max(1, team2.sets) }).map((_, i) => (
                        <Trophy key={i} className={cn("w-5 h-5", team2.sets > i ? 'text-primary' : 'text-muted-foreground/30')} />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono mt-2 text-4xl font-bold">
                <p className="text-left">{team1.games}</p>
                <div></div>
                <p className="text-right">{team2.games}</p>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono mt-1 text-5xl font-bold text-primary">
                <p className={cn("text-left", team1.points === 'ADV' && 'text-accent')}>{team1.points}</p>
                {isDeuce && <p className="text-center text-xl text-amber-500 animate-pulse">DEUCE</p>}
                {!isDeuce && <div></div>}
                <p className={cn("text-right", team2.points === 'ADV' && 'text-accent')}>{team2.points}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
