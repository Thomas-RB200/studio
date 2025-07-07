'use client';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useScoreboard } from '@/context/ScoreboardContext';
import { useMemo, useState, useEffect } from 'react';

// Helper function to get all subordinate user IDs recursively
const getSubordinateIds = (managerId: string, allUsers: User[]): string[] => {
    const directSubordinates = allUsers.filter(u => u.creatorId === managerId);
    let allSubordinateIds = directSubordinates.map(u => u.id);

    directSubordinates.forEach(subordinate => {
        allSubordinateIds = [...allSubordinateIds, ...getSubordinateIds(subordinate.id, allUsers)];
    });

    return allSubordinateIds;
};

export default function OverlayLinks() {
    const { toast } = useToast();
    const { scoreboards, currentUser, users } = useScoreboard();
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({ title: '¡Copiado!', description: 'La URL del overlay ha sido copiada al portapapeles.' });
    };

    const visibleScoreboards = useMemo(() => {
        if (!currentUser) return [];

        const refereeScoreboards = scoreboards.filter(sb => sb.refereeId);

        if (currentUser.role === 'Hyper Admin') {
          return refereeScoreboards;
        }
        
        const managedUserIds = getSubordinateIds(currentUser.id, users);
        const allVisibleUserIds = new Set(managedUserIds);

        return refereeScoreboards.filter(sb => sb.refereeId && allVisibleUserIds.has(sb.refereeId));

    }, [currentUser, scoreboards, users]);


    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Enlaces de Overlay</CardTitle>
                    <CardDescription>Usa estos enlaces en tu software de streaming (OBS, Streamlabs) para mostrar los marcadores en vivo.</CardDescription>
                </CardHeader>
                <CardContent>
                    {visibleScoreboards.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cancha</TableHead>
                                    <TableHead>URL del Overlay</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleScoreboards.map(sb => {
                                    const overlayUrl = `${origin}/stream?overlay=true&id=${sb.id}`;
                                    return (
                                        <TableRow key={sb.id}>
                                            <TableCell className="font-medium">{sb.courtName}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input type="text" readOnly value={overlayUrl} className="bg-muted flex-grow"/>
                                                    <Button variant="outline" size="icon" onClick={() => handleCopy(overlayUrl)} disabled={!origin}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                         <p className="text-sm text-muted-foreground">No hay canchas asignadas a jueces en su cadena de mando.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
