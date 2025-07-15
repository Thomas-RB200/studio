'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useScoreboard } from '@/context/ScoreboardContext';
import Scoreboard from '@/components/scoreboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, Timer, Dumbbell, Plus, Minus, RotateCcw, Target } from 'lucide-react';
import type { Scoreboard as ScoreboardType, UserRole } from '@/lib/types';
import DashboardLayout from '@/components/dashboard-layout';
import ThemeCustomizer from '@/components/theme-customizer';
import {
 import io from 'socket.io-client';
 import { Socket } from 'socket.io-client';
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ErrorBoundary from '@/components/error-boundary';

// Only users with the 'Referee' role can access this page.
const REFEREE_ROLES: UserRole[] = ['Referee'];

const RefereeControls = ({ scoreboard }: { scoreboard: ScoreboardType }) => {
    const { handleScoreChange, handleGameTimer, startServeTimer, startWarmupTimer, pointValues, theme, resetScore, setServingTeam } = useScoreboard();
    if (!scoreboard) return null;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold text-center">{scoreboard.courtName}</h1>
            <div className="w-full max-w-6xl mx-auto">
                <Scoreboard 
                    teams={scoreboard.teams}
                    score={scoreboard.score}
                    pointValues={pointValues}
                    timers={scoreboard.timers}
                    theme={theme}
                    isReadOnly={true}
                    servingTeam={scoreboard.servingTeam}
                    tournamentName={scoreboard.tournamentName}
                    matchName={scoreboard.matchName}
                />
            </div>

            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle>Controles del Partido</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 items-start gap-4">
                    {/* Team A Controls */}
                    <div className="flex flex-col items-center gap-2">
                         <span className="font-semibold text-lg truncate">{scoreboard.teams.teamA}</span>
                         <div className="flex items-center gap-4">
                            <Button variant="outline" size="lg" onClick={() => handleScoreChange(scoreboard.id, 'teamA', 1)}><Plus /></Button>
                            <Button variant="outline" size="lg" onClick={() => handleScoreChange(scoreboard.id, 'teamA', -1)}><Minus /></Button>
                        </div>
                    </div>
                    
                    {/* Center Controls */}
                    <div className="flex flex-col justify-center items-center gap-4 border-x-2 h-full py-4">
                        <div className="flex gap-2">
                          <Button onClick={() => handleGameTimer(scoreboard.id)} variant="outline" title={scoreboard.timers.isGameRunning ? "Pausar Juego" : "Iniciar Juego"}>
                              {scoreboard.timers.isGameRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                              {scoreboard.timers.isGameRunning ? "Pausar" : "Iniciar"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" title="Reiniciar Marcador">
                                  <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción reiniciará los puntos, juegos, sets y todos los cronómetros para esta cancha. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => resetScore(scoreboard.id)}>Continuar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        <div className="flex gap-2">
                           <Button onClick={() => startServeTimer(scoreboard.id)} variant="outline" title="Tiempo de Saque">
                              <Timer className="mr-2 h-4 w-4" /> Saque
                          </Button>
                          <Button onClick={() => startWarmupTimer(scoreboard.id)} variant="outline" title="Tiempo de Calentamiento">
                              <Dumbbell className="mr-2 h-4 w-4" /> Calent.
                          </Button>
                        </div>

                        <div className="flex flex-col items-center gap-2 pt-4">
                            <p className="text-sm font-medium text-muted-foreground">Control de Saque</p>
                            <div className="flex gap-2">
                                <Button variant={scoreboard.servingTeam === 'teamA' ? 'default' : 'outline'} onClick={() => setServingTeam(scoreboard.id, 'teamA')} size="sm">
                                    <Target className="mr-2 h-4 w-4" /> {scoreboard.teams.teamA.split('/')[0].trim()}
                                </Button>
                                <Button variant={scoreboard.servingTeam === 'teamB' ? 'default' : 'outline'} onClick={() => setServingTeam(scoreboard.id, 'teamB')} size="sm">
                                    <Target className="mr-2 h-4 w-4" /> {scoreboard.teams.teamB.split('/')[0].trim()}
                                </Button>
                            </div>
                        </div>

                    </div>
                    
                    {/* Team B Controls */}
                    <div className="flex flex-col items-center gap-2">
                         <span className="font-semibold text-lg truncate">{scoreboard.teams.teamB}</span>
                         <div className="flex items-center gap-4">
                            <Button variant="outline" size="lg" onClick={() => handleScoreChange(scoreboard.id, 'teamB', 1)}><Plus /></Button>
                            <Button variant="outline" size="lg" onClick={() => handleScoreChange(scoreboard.id, 'teamB', -1)}><Minus /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const RefereePageFallback = () => (
    <div className="flex h-full w-full items-center justify-center bg-destructive text-destructive-foreground p-4">
        <h1 className="text-2xl font-bold text-center">An error occurred in the referee panel. It has been reported.</h1>
    </div>
)

function RefereePageView() {
  const {
    theme, setTheme,
    scoreboards,
    currentUser,
    updateScoreboard,
    isInitialized,
  } = useScoreboard();
 const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();
  const [activeView, setActiveView] = useState('live');

  // This is the robust way to find the scoreboard.
  // It directly uses the currentUser from the context, which is the source of truth.
  // This removes the dependency on sessionStorage, which was causing issues.
  const scoreboard = useMemo(() => {
    if (!currentUser) {
      return null;
    }
    return scoreboards.find(sb => sb.refereeId === currentUser.id) || null;
  }, [scoreboards, currentUser]);


  useEffect(() => {
    if (!isInitialized) return;

    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role && !REFEREE_ROLES.includes(currentUser.role)) {
      // If a non-referee (like an Admin) lands here, send them to the main dashboard.
      router.push('/'); 
    }
  }, [currentUser, router, isInitialized]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
    });
  }, []);
  const renderView = () => {
    switch (activeView) {
      case 'theme':
        return <ThemeCustomizer 
            theme={theme} 
            setTheme={setTheme}
            scoreboard={scoreboard}
            updateScoreboard={updateScoreboard}
            onSaveChanges={() => setActiveView('live')}
            onCancel={() => setActiveView('live')}
        />;
      case 'live':
      default:
        return scoreboard ? <RefereeControls scoreboard={scoreboard} /> : <div className="p-4 text-center">Cargando control de cancha... Si esto persiste, contacte a un administrador para que le asigne una.</div>;
    }
  };

  // Modify the handleScoreChange function. Inside this function, after any existing logic, add the following code to emit the websocket event:
  const handleScoreChange = (scoreboardId: string, team: 'teamA' | 'teamB', points: number) => {
    if (socket && scoreboard) {
      const updatedScoreboard = {
          ...scoreboard,
          score: {
              ...scoreboard.score,
              [team]: (scoreboard.score[team] || 0) + points
          }
    }
  };

  if (!isInitialized || !currentUser || (currentUser.role && !REFEREE_ROLES.includes(currentUser.role))) {
    return <div className="flex items-center justify-center h-screen">Authenticating...</div>;
  }

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </DashboardLayout>
  );
}

export default function RefereePage() {
    return (
        <ErrorBoundary fallback={<RefereePageFallback/>}>
            <RefereePageView />
        </ErrorBoundary>
    )
}
