'use client';

import { useScoreboard } from '@/context/ScoreboardContext';
import Scoreboard from '@/components/scoreboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/lib/types';
import { useMemo } from 'react';

// Helper function to get all subordinate user IDs recursively
const getSubordinateIds = (managerId: string, allUsers: User[]): string[] => {
    const directSubordinates = allUsers.filter(u => u.creatorId === managerId);
    let allSubordinateIds = directSubordinates.map(u => u.id);

    directSubordinates.forEach(subordinate => {
        allSubordinateIds = [...allSubordinateIds, ...getSubordinateIds(subordinate.id, allUsers)];
    });

    return allSubordinateIds;
};


export default function LiveView() {
  const { scoreboards, pointValues, theme, ads, currentUser, users } = useScoreboard();

  const visibleScoreboards = useMemo(() => {
    if (!currentUser) return [];

    const activeScoreboards = scoreboards.filter(sb => sb.isActive);

    if (currentUser.role === 'Hyper Admin') {
      return activeScoreboards;
    }
    
    // Get all users managed by the current user, recursively
    const managedUserIds = getSubordinateIds(currentUser.id, users);
    const allVisibleUserIds = new Set(managedUserIds);

    return activeScoreboards.filter(sb => sb.refereeId && allVisibleUserIds.has(sb.refereeId));

  }, [currentUser, scoreboards, users]);

  return (
    <div className="p-4 space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Marcadores en Vivo</CardTitle>
        </CardHeader>
        <CardContent>
            {visibleScoreboards.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {visibleScoreboards.map(sb => (
                        <div key={sb.id}>
                            <h2 className="text-xl font-semibold mb-2 text-center">{sb.courtName}</h2>
                            <Scoreboard 
                              teams={sb.teams}
                              score={sb.score}
                              pointValues={pointValues}
                              theme={theme}
                              timers={sb.timers}
                              servingTeam={sb.servingTeam}
                              isReadOnly={true}
                              tournamentName={sb.tournamentName}
                              matchName={sb.matchName}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No hay partidos activos en su cadena de mando.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
