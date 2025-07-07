import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Minus, Play, Plus, RefreshCw, Timer } from "lucide-react";

type ScoreControlsProps = {
    team1Name: string;
    team2Name: string;
    onAddPoint?: (teamIndex: 1 | 2) => void;
    onSubtractPoint?: (teamIndex: 1 | 2) => void;
    disabled?: boolean;
}

export default function ScoreControls({ team1Name, team2Name, onAddPoint, onSubtractPoint, disabled }: ScoreControlsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Controles del Partido</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold truncate flex-1 text-right">{team1Name}</span>
                        <Button size="icon" variant="outline" className="w-10 h-10" onClick={() => onAddPoint?.(1)} disabled={disabled}>
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="outline" className="w-10 h-10" onClick={() => onSubtractPoint?.(1)} disabled={disabled}>
                            <Minus className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2 border-x px-4">
                        <Button variant="outline" className="justify-start"><Play className="mr-2 h-4 w-4" /> Iniciar</Button>
                        <Button variant="outline" className="justify-start"><Timer className="mr-2 h-4 w-4" /> Saque</Button>
                        <Button variant="outline" className="justify-start"><Dumbbell className="mr-2 h-4 w-4" /> Calent.</Button>
                        <Button variant="destructive" className="justify-start ring-1 ring-inset ring-transparent hover:ring-ring focus:ring-ring"><RefreshCw className="mr-2 h-4 w-4" /> Reiniciar</Button>
                    </div>

                     <div className="flex items-center justify-center gap-2">
                        <Button size="icon" variant="outline" className="w-10 h-10" onClick={() => onAddPoint?.(2)} disabled={disabled}>
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="outline" className="w-10 h-10" onClick={() => onSubtractPoint?.(2)} disabled={disabled}>
                            <Minus className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold truncate flex-1 text-left">{team2Name}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
