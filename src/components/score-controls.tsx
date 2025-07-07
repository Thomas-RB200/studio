import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ScoreControlsProps = {
    team1Name: string;
    team2Name: string;
    onAddPoint?: (teamIndex: 1 | 2) => void;
    disabled?: boolean;
}

export default function ScoreControls({ team1Name, team2Name, onAddPoint, disabled }: ScoreControlsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
                className="h-24 text-xl bg-primary/20 text-primary-foreground hover:bg-primary/30 border-2 border-primary/50" 
                onClick={() => onAddPoint?.(1)}
                disabled={disabled}
            >
                <Plus className="mr-4 h-8 w-8" />
                Point to <br /> {team1Name}
            </Button>
            <Button 
                className="h-24 text-xl bg-accent/20 text-accent-foreground/80 hover:bg-accent/30 border-2 border-accent/50 text-black" 
                onClick={() => onAddPoint?.(2)}
                disabled={disabled}
            >
                <Plus className="mr-4 h-8 w-8" />
                Point to <br /> {team2Name}
            </Button>
        </div>
    )
}
