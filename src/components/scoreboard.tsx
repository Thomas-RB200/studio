import { Swords, Trophy, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

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
};

export type ScoreboardProps = GameState & {
  isOverlay?: boolean;
  isScoringPage?: boolean;
};


export function Scoreboard({ courtName, team1, team2, isDeuce, isOverlay = false, isScoringPage = false }: ScoreboardProps) {
  
  if (isScoringPage) {
    const TeamRow = ({ name, sets, games, points }: TeamState) => (
      <div className="flex justify-between items-center py-2">
        <p className="text-lg text-muted-foreground truncate w-1/2">{name}</p>
        <div className="flex gap-4 md:gap-8 items-center font-bold text-2xl">
          <span className="text-primary w-8 text-center">{sets}</span>
          <span className="text-primary w-8 text-center">{games}</span>
          <span className="text-primary w-8 text-center">{points}</span>
        </div>
      </div>
    );

    return (
      <Card>
        <CardContent className="p-4 space-y-1">
           <div className="flex justify-end pr-[6px]">
             <div className="flex gap-4 md:gap-8 items-center font-semibold text-xs text-muted-foreground">
                <span className="w-8 text-center">SETS</span>
                <span className="w-8 text-center">JUEGOS</span>
                <span className="w-8 text-center">PUNTOS</span>
             </div>
          </div>
          <TeamRow {...team1} />
          <Separator />
          <TeamRow {...team2} />
          <Separator />
          <div className="flex items-center gap-2 text-muted-foreground pt-2">
            <Clock className="w-5 h-5" />
            <span>00:00</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
