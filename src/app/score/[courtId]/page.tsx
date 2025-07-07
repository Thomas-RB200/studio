import { Header } from "@/components/header";
import { Scoreboard, type GameState, type ScoreboardProps } from "@/components/scoreboard";
import ScoreControls from "@/components/score-controls";

const game: GameState = {
  courtName: "Cancha 1",
  team1: { name: "Pareja / xdcfghnjklñ", points: "0", games: 0, sets: 0 },
  team2: { name: "Pareja B1 / zxcvbnm", points: "0", games: 0, sets: 0 },
};

export default function ScoringPage({ params }: { params: { courtId: string } }) {
  const scoreboardProps: ScoreboardProps = { ...game, courtName: `Cancha ${params.courtId}`, isScoringPage: true };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">
            Cancha {params.courtId}
        </h1>
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <Scoreboard {...scoreboardProps} />
          <ScoreControls team1Name={game.team1.name} team2Name={game.team2.name} />
        </div>
      </main>
    </div>
  );
}
