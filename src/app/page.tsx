import { Scoreboard, type GameState } from "@/components/scoreboard";
import { Header } from "@/components/header";
import { PadelIcon } from "@/components/icons";

// Mock data for multiple games
const games: GameState[] = [
  {
    courtName: "Court 1",
    team1: { name: "Alex / Juan", points: "30", games: 4, sets: 1 },
    team2: { name: "Maria / Sofia", points: "40", games: 5, sets: 0 },
  },
  {
    courtName: "Court 2",
    team1: { name: "Carlos / David", points: "15", games: 2, sets: 1 },
    team2: { name: "Laura / Ana", points: "0", games: 1, sets: 1 },
  },
  {
    courtName: "Court 3",
    team1: { name: "Pedro / Miguel", points: "40", games: 6, sets: 1 },
    team2: { name: "Lucia / Elena", points: "40", games: 6, sets: 1 },
    isDeuce: true,
  },
  {
    courtName: "Court 4",
    team1: { name: "Javi / Sergio", points: "ADV", games: 3, sets: 0 },
    team2: { name: "Paula / Cris", points: "40", games: 3, sets: 0 },
  },
   {
    courtName: "Court 5",
    team1: { name: "Mario / Oscar", points: "0", games: 0, sets: 0 },
    team2: { name: "Eva / Sara", points: "0", games: 0, sets: 0 },
  },
  {
    courtName: "Court 6",
    team1: { name: "Ruben / Victor", points: "30", games: 5, sets: 0 },
    team2: { name: "Nerea / Alba", points: "15", games: 4, sets: 1 },
  },
];

export default function PublicDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
            <PadelIcon className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground/90">
                Live Matches
            </h1>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
          {games.map((game, index) => (
            <Scoreboard key={index} {...game} />
          ))}
        </div>
      </main>
      <footer
        className="h-16 flex items-center justify-center bg-muted/50 border-t"
        style={{ marginTop: 'auto' }}
      >
        <p className="text-sm text-muted-foreground">Advertisement Space</p>
      </footer>
    </div>
  );
}
