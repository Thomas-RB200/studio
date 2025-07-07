import { Header } from "@/components/header";
import { Scoreboard, type GameState } from "@/components/scoreboard";
import ScoreControls from "@/components/score-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link as LinkIcon, Timer, Undo } from "lucide-react";
import Link from 'next/link';

// This would typically come from a state management solution or API
const game: GameState = {
  courtName: "Central Court",
  team1: { name: "Alex / Juan", points: "30", games: 4, sets: 1 },
  team2: { name: "Maria / Sofia", points: "40", games: 5, sets: 0 },
};

export default function ScoringPage({ params }: { params: { courtId: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader>
                <CardTitle className="text-center text-2xl md:text-3xl font-headline tracking-tight">
                    Scoring: Court {params.courtId}
                </CardTitle>
            </CardHeader>
            <CardContent>
              <Scoreboard {...game} />
              <Separator className="my-6" />
              <ScoreControls team1Name={game.team1.name} team2Name={game.team2.name} />
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base font-medium">Timers</CardTitle>
                          <Timer className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Warm-up</Button>
                          <Button variant="outline" size="sm">Serve</Button>
                          <Button variant="outline" size="sm">Medical</Button>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base font-medium">Actions</CardTitle>
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                       <CardContent className="flex flex-wrap gap-2">
                          <Button variant="destructive" size="sm">
                              <Undo className="mr-2 h-4 w-4"/>
                              Undo Last Point
                          </Button>
                          <Button variant="secondary" asChild size="sm">
                              <Link href={`/overlay/${params.courtId}`} target="_blank">
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  Overlay Link
                              </Link>
                          </Button>
                      </CardContent>
                  </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
