'use client';

import type { User, Scoreboard, UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, PlusCircle, Trash2, User as UserIcon, Mail, Shield, Grid, KeyRound, Workflow, Info } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScoreboard } from '@/context/ScoreboardContext';


const defaultTimerState = {
    gameStartTime: null, isGameRunning: false, accumulatedTime: 0,
    activeCountdown: { type: null, endTime: null },
};

const COURT_ASSIGNABLE_ROLES: UserRole[] = ['Referee'];

const getSubordinates = (managerId: string, allUsers: User[]): User[] => {
    const directSubordinates = allUsers.filter(u => u.creatorId === managerId);
    let allSubordinates: User[] = [...directSubordinates];
    directSubordinates.forEach(subordinate => {
        allSubordinates = [...allSubordinates, ...getSubordinates(subordinate.id, allUsers)];
    });
    return allSubordinates;
};

interface UserManagerProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const UserManagerComponent = ({ users, setUsers }: UserManagerProps) => {
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentUserForm, setCurrentUserForm] = useState<Partial<User>>({});
    const [courtName, setCourtName] = useState('');
    const [courtTournamentName, setCourtTournamentName] = useState('');
    const [courtMatchName, setCourtMatchName] = useState('');
    const { scoreboards, addScoreboard, updateScoreboard, currentUser: loggedInUser, theme } = useScoreboard();

    const visibleUsers = useMemo(() => {
        if (!loggedInUser) return [];
        if (loggedInUser.role === 'Hyper Admin') {
            return users.filter(u => u.id !== loggedInUser.id);
        }
        return getSubordinates(loggedInUser.id, users);
    }, [loggedInUser, users]);

    const availableRoles: UserRole[] = useMemo(() => {
      if (loggedInUser?.role === 'Hyper Admin') return ['Super Admin', 'Admin', 'Referee'];
      if (loggedInUser?.role === 'Super Admin') return ['Admin', 'Referee'];
      if (loggedInUser?.role === 'Admin') return ['Referee'];
      return [];
    }, [loggedInUser]);

    const creationLimits = useMemo(() => {
        if (!loggedInUser) return {};
        const directSubordinates = users.filter(u => u.creatorId === loggedInUser.id);
        const limits: { [key in UserRole]?: { limit: number; count: number } } = {};
        switch (loggedInUser.role) {
            case 'Hyper Admin':
                limits['Super Admin'] = { limit: 5, count: directSubordinates.filter(u => u.role === 'Super Admin').length };
                break;
            case 'Super Admin':
                limits['Admin'] = { limit: 5, count: directSubordinates.filter(u => u.role === 'Admin').length };
                limits['Referee'] = { limit: 10, count: directSubordinates.filter(u => u.role === 'Referee').length };
                break;
            case 'Admin':
                limits['Referee'] = { limit: 10, count: directSubordinates.filter(u => u.role === 'Referee').length };
                break;
        }
        return limits;
    }, [loggedInUser, users]);

    const canCreateNewUser = useMemo(() => {
        if (availableRoles.length === 0) return false;
        return availableRoles.some(role => {
            const limitInfo = creationLimits[role as UserRole];
            return !limitInfo || limitInfo.count < limitInfo.limit;
        });
    }, [availableRoles, creationLimits]);

    useEffect(() => {
        if (currentUserForm.role && COURT_ASSIGNABLE_ROLES.includes(currentUserForm.role) && currentUserForm.id) {
            const sb = scoreboards.find(s => s.refereeId === currentUserForm.id);
            setCourtName(sb?.courtName || '');
            setCourtTournamentName(sb?.tournamentName || '');
            setCourtMatchName(sb?.matchName || '');
        } else {
            setCourtName('');
            setCourtTournamentName('');
            setCourtMatchName('');
        }
    }, [currentUserForm, scoreboards]);

    const handleSaveUser = () => {
        if (!currentUserForm.name || !currentUserForm.email || !currentUserForm.role) {
            toast({ title: "Error", description: "Name, email, and role are required.", variant: "destructive" });
            return;
        }

        if (currentUserForm.id) { // Editing existing user
            const originalUserIndex = users.findIndex(u => u.id === currentUserForm.id);
            if (originalUserIndex === -1) return;

            // Prepare the updated user data
            const updatedUser = { ...users[originalUserIndex], ...currentUserForm } as User;
            if (!currentUserForm.password) delete updatedUser.password;
            
            const updatedUsers = [...users];
            updatedUsers[originalUserIndex] = updatedUser;
            setUsers(updatedUsers);

            // Handle scoreboard association based on role and status
            const wasReferee = users[originalUserIndex].role === 'Referee';
            const isNowReferee = updatedUser.role === 'Referee';
            const existingSb = scoreboards.find(sb => sb.refereeId === updatedUser.id);

            if (isNowReferee) {
                if (existingSb) {
                    // User is still a referee, check for updates to their scoreboard
                    const scoreboardUpdates: Partial<Scoreboard> = {};
                    if (courtName && existingSb.courtName !== courtName) scoreboardUpdates.courtName = courtName;
                    if (courtTournamentName !== existingSb.tournamentName) scoreboardUpdates.tournamentName = courtTournamentName;
                    if (courtMatchName !== existingSb.matchName) scoreboardUpdates.matchName = courtMatchName;
                    if (existingSb.isActive !== (updatedUser.status === 'Active')) scoreboardUpdates.isActive = updatedUser.status === 'Active';

                    if (Object.keys(scoreboardUpdates).length > 0) {
                        updateScoreboard(existingSb.id, scoreboardUpdates);
                    }
                } else {
                    // User was just made a referee, create a scoreboard for them
                     addScoreboard({
                        courtName: courtName || `Cancha de ${updatedUser.name}`,
                        tournamentName: courtTournamentName || theme.tournamentName,
                        matchName: courtMatchName || theme.matchName,
                        refereeId: updatedUser.id,
                        isActive: updatedUser.status === 'Active',
                        teams: { teamA: 'Pareja A', teamB: 'Pareja B' },
                        score: { teamA: { points: 0, games: 0 }, teamB: { points: 0, games: 0 }, sets: [] },
                        timers: defaultTimerState,
                        servingTeam: 'teamA',
                    });
                }
            } else if (wasReferee && existingSb) {
                // User is no longer a referee, disassociate and deactivate their old scoreboard
                updateScoreboard(existingSb.id, { refereeId: null, isActive: false });
            }
            
            toast({ title: "Success", description: "User updated successfully." });
        } else { // Adding new user
            if (!currentUserForm.password) {
                toast({ title: "Error", description: "Password is required for new users.", variant: "destructive" });
                return;
            }
            
            if (loggedInUser && currentUserForm.role) {
                const limitInfo = creationLimits[currentUserForm.role as UserRole];
                if (limitInfo && limitInfo.count >= limitInfo.limit) {
                    toast({ title: "Limit Reached", description: `You can only create up to ${limitInfo.limit} ${currentUserForm.role}s.`, variant: "destructive" });
                    return;
                }
            }

            const newId = `user-${Date.now()}`;
            const newUser: User = {
                id: newId,
                status: 'Active',
                ...currentUserForm,
                creatorId: loggedInUser?.id,
            } as User;

            if (newUser.role && COURT_ASSIGNABLE_ROLES.includes(newUser.role)) {
                const newCourtName = courtName || `Cancha de ${newUser.name}`;
                addScoreboard({
                    courtName: newCourtName,
                    tournamentName: courtTournamentName || theme.tournamentName,
                    matchName: courtMatchName || theme.matchName,
                    refereeId: newId, 
                    isActive: newUser.status === 'Active',
                    teams: { teamA: 'Pareja A', teamB: 'Pareja B' },
                    score: { teamA: { points: 0, games: 0 }, teamB: { points: 0, games: 0 }, sets: [] },
                    timers: defaultTimerState,
                    servingTeam: 'teamA',
                });
            }
            setUsers([...users, newUser]);
            toast({ title: "Success", description: "User and associated court created successfully." });
        }
        setDialogOpen(false);
    };

    const canPerformAction = (targetUser: User): boolean => {
      if (!loggedInUser) return false;
      if (loggedInUser.role === 'Hyper Admin') return targetUser.role !== 'Hyper Admin';
      const subordinateIds = getSubordinates(loggedInUser.id, users).map(u => u.id);
      return subordinateIds.includes(targetUser.id);
    }

    const handleEdit = (user: User) => {
        if (!canPerformAction(user)) {
            toast({ title: "Permission Denied", description: "You cannot edit this user.", variant: "destructive"});
            return;
        }
        setCurrentUserForm({ ...user, password: ''});
        setDialogOpen(true);
    };
    
    const handleAddNew = () => {
        const defaultRole = availableRoles.find(role => {
             const limitInfo = creationLimits[role as UserRole];
             return !limitInfo || limitInfo.count < limitInfo.limit;
        });
        setCurrentUserForm({role: defaultRole, status: 'Active'});
        setCourtName('');
        setCourtTournamentName('');
        setCourtMatchName('');
        setDialogOpen(true);
    }

    const handleDelete = (userToDelete: User) => {
        if (!canPerformAction(userToDelete)) {
            toast({ title: "Permission Denied", description: "You cannot delete this user.", variant: "destructive"});
            return;
        }
        const associatedSb = scoreboards.find(sb => sb.refereeId === userToDelete.id);
        if (associatedSb) {
            updateScoreboard(associatedSb.id, { refereeId: null, isActive: false });
        }
        setUsers(users.filter((u) => u.id !== userToDelete.id));
        toast({ title: "Success", description: "User deleted successfully." });
    };

    return (
        <div className="p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Courts &amp; Users</CardTitle>
                        <CardDescription>Add, assign, and manage user accounts and their assigned courts.</CardDescription>
                    </div>
                    {availableRoles.length > 0 && <Button onClick={handleAddNew} disabled={!canCreateNewUser}>
                        <PlusCircle /> Add New User
                    </Button>}
                </CardHeader>
                <CardContent>
                    {/* Mobile View */}
                    <div className="md:hidden">
                        <div className="space-y-4">
                            {visibleUsers.map((user) => {
                                const court = COURT_ASSIGNABLE_ROLES.includes(user.role) 
                                    ? scoreboards.find(sb => sb.refereeId === user.id)
                                    : undefined;
                                const actionIsDisabled = !canPerformAction(user);

                                return (
                                    <Card key={user.id}>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-start">
                                                {user.name}
                                                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                                                    {user.status}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription>{user.email}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm"><Shield className="h-4 w-4 text-muted-foreground" /> {user.role}</div>
                                            <div className="flex items-center gap-2 text-sm"><Grid className="h-4 w-4 text-muted-foreground" /> {court?.courtName || 'N/A'}</div>
                                        </CardContent>
                                        <CardFooter className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(user)} disabled={actionIsDisabled}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(user)} disabled={actionIsDisabled}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Court</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {visibleUsers.map((user) => {
                                const court = COURT_ASSIGNABLE_ROLES.includes(user.role) 
                                    ? scoreboards.find(sb => sb.refereeId === user.id)
                                    : undefined;
                                const actionIsDisabled = !canPerformAction(user);

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{court?.courtName || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} disabled={actionIsDisabled}>
                                            <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(user)} disabled={actionIsDisabled}>
                                            <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
      
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentUserForm.id ? 'Edit User' : 'Add New User'}</DialogTitle>
                        {isDialogOpen && !currentUserForm.id && Object.keys(creationLimits).length > 0 && (
                            <DialogDescription asChild className="pt-2">
                                <div>
                                    <p className="font-medium">Creation Limits:</p>
                                    {Object.entries(creationLimits).map(([role, limitInfo]) => (
                                        <p key={role} className="text-sm text-muted-foreground pl-4">
                                            - {role}s: {limitInfo.count} / {limitInfo.limit}
                                        </p>
                                    ))}
                                </div>
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                             <div className="relative col-span-3">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="name" value={currentUserForm.name || ''} onChange={(e) => setCurrentUserForm({...currentUserForm, name: e.target.value})} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                             <div className="relative col-span-3">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" value={currentUserForm.email || ''} onChange={(e) => setCurrentUserForm({...currentUserForm, email: e.target.value})} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <div className="relative col-span-3">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={currentUserForm.password || ''} 
                                    onChange={(e) => setCurrentUserForm({...currentUserForm, password: e.target.value})} 
                                    className="pl-10"
                                    placeholder={currentUserForm.id ? "Leave blank to keep unchanged" : "Required"}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <div className="relative col-span-3">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                <Select value={currentUserForm.role} onValueChange={(value: UserRole) => setCurrentUserForm({...currentUserForm, role: value})} disabled={!!currentUserForm.id && loggedInUser?.role !== 'Hyper Admin'}>
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map(role => {
                                            const limitInfo = creationLimits[role as UserRole];
                                            const isDisabled = !currentUserForm.id && (limitInfo ? limitInfo.count >= limitInfo.limit : false);
                                            return <SelectItem key={role} value={role} disabled={isDisabled}>{role}{isDisabled ? ' (Limit Reached)' : ''}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {currentUserForm.role && COURT_ASSIGNABLE_ROLES.includes(currentUserForm.role) && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="courtName" className="text-right">Court Name</Label>
                                    <div className="relative col-span-3">
                                        <Grid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="courtName" value={courtName} onChange={(e) => setCourtName(e.target.value)} className="pl-10" placeholder="e.g. Cancha Central" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="tournamentName" className="text-right">Tournament</Label>
                                     <div className="relative col-span-3">
                                        <Workflow className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="tournamentName" value={courtTournamentName} onChange={(e) => setCourtTournamentName(e.target.value)} className="pl-10" placeholder={theme.tournamentName || "e.g. World Padel Tour"} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="matchName" className="text-right">Match Info</Label>
                                    <div className="relative col-span-3">
                                        <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="matchName" value={courtMatchName} onChange={(e) => setCourtMatchName(e.target.value)} className="pl-10" placeholder={theme.matchName || "e.g. Final"} />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                             <div className="relative col-span-3">
                                <Select value={currentUserForm.status} onValueChange={(value: 'Active' | 'Inactive') => setCurrentUserForm({...currentUserForm, status: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSaveUser}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const UserManager = React.memo(UserManagerComponent);
export default UserManager;
