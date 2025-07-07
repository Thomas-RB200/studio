import { Scoreboard, type GameState } from "@/components/scoreboard";

// This would typically come from a state management solution or API
const game: GameState = {
  courtName: "Central Court",
  team1: { name: "Alex / Juan", points: "30", games: 4, sets: 1 },
  team2: { name: "Maria / Sofia", points: "40", games: 5, sets: 0 },
};

export default function OverlayPage({ params }: { params: { courtId: string } }) {
  // In a real app, you'd fetch game data for params.courtId
  
  return (
    <div className="p-4 bg-transparent">
      <Scoreboard {...game} isOverlay={true} />
    </div>
  );
}
