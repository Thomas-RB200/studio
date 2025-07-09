'use client';

import type { Ad, User, Theme, TimerState, Scoreboard, UserRole, GlobalState, SetScore } from '@/lib/types';
import React, from 'react';

const pointValues = ['0', '15', '30', '40', 'AD'];

interface ScoreboardContextType extends GlobalState {
  setTheme: (theme: Theme) => void;
  setAds: (ads: Ad[]) => void;
  setUsers: (users: User[]) => void;
  pointValues: string[];
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  updateScoreboard: (id: string, updates: Partial<Scoreboard>) => void;
  handleScoreChange: (scoreboardId: string, team: 'teamA' | 'teamB', change: 1 | -1) => void;
  resetScore: (scoreboardId: string) => void;
  handleGameTimer: (scoreboardId: string) => void;
  startServeTimer: (scoreboardId: string) => void;
  startWarmupTimer: (scoreboardId: string) => void;
  addScoreboard: (newScoreboard: Omit<Scoreboard, 'id'>) => void;
  setServingTeam: (scoreboardId: string, team: 'teamA' | 'teamB') => void;
  isInitialized: boolean;
}

const ScoreboardContext = React.createContext<ScoreboardContextType | undefined>(undefined);

const COURT_ASSIGNABLE_ROLES: UserRole[] = ['Referee'];

const hyperAdminId = 'hyper-admin-user';
const hyperAdminId2 = 'hyper-admin-user-2';
const superAdminId = 'super-admin-user';
const adminId = 'admin-user';

const referees: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: `referee-user-${i + 1}`,
    name: `Referee ${i + 1}`,
    email: `referee${i+1}@example.com`,
    password: 'referee',
    role: 'Referee',
    status: 'Active',
    creatorId: adminId,
}));

// Scoreboards are now created without specific tournament/match names.
// They will inherit from the theme by default.
const scoreboards: Scoreboard[] = Array.from({ length: 10 }, (_, i) => ({
    id: `court-${i + 1}`,
    courtName: `Cancha ${i + 1}`,
    refereeId: `referee-user-${i + 1}`,
    isActive: false, // All courts are inactive by default
    teams: { teamA: `Antonio Luque / Miguel Oliveira`, teamB: `Miguel Yanguas / Aris Patiniotis` },
    score: { teamA: { points: 0, games: 0 }, teamB: { points: 0, games: 0 }, sets: [] },
    timers: {
        gameStartTime: null,
        isGameRunning: false,
        accumulatedTime: 0,
        activeCountdown: {
            type: null,
            endTime: null,
        },
    },
    servingTeam: 'teamA',
}));


const defaultState: GlobalState = {
  theme: {
    scoreboardTitle: 'Padelicius Score',
    primaryColor: '#e11d48',
    backgroundColor: '#1e1b4b',
    textColor: '#f8fafc',
    accentColor: '#f59e0b',
    backgroundType: 'color',
    backgroundImage: null,
    tournamentName: 'World Padel Tour',
    matchName: 'Victoria',
  },
  ads: [
    { id: '1', title: 'Nike', imageUrl: 'https://placehold.co/400x120/000000/FFFFFF/png?text=NIKE&font=raleway', 'data-ai-hint': 'nike logo' },
    { id: '2', title: 'Adidas', imageUrl: 'https://placehold.co/400x120/FFFFFF/000000/png?text=ADIDAS&font=lato', 'data-ai-hint': 'adidas logo' },
    { id: '3', title: 'Wilson', imageUrl: 'https://placehold.co/400x120/D32F2F/FFFFFF/png?text=Wilson&font=roboto', 'data-ai-hint': 'wilson logo' },
    { id: '4', title: 'Head', imageUrl: 'https://placehold.co/400x120/FFA000/000000/png?text=HEAD&font=oswald', 'data-ai-hint': 'head logo' }
  ],
  users: [
    { id: hyperAdminId, name: 'Hyper Admin User', email: 'thomyfrb@gmail.com', password: 'Thomas4590', role: 'Hyper Admin', status: 'Active' },
    { id: hyperAdminId2, name: 'Ricardo Veloz', email: 'ricardoveloz24@gmail.com', password: 'RICARDO4080', role: 'Hyper Admin', status: 'Active' },
    { id: superAdminId, name: 'Super Admin User', email: 'super@example.com', password: 'super', role: 'Super Admin', status: 'Active', creatorId: hyperAdminId },
    { id: adminId, name: 'Admin User', email: 'admin@example.com', password: 'admin', role: 'Admin', status: 'Active', creatorId: superAdminId },
    ...referees,
  ],
  scoreboards: scoreboards,
};

const LOCAL_STORAGE_KEY = 'padelScoreboardState_v15';
const SESSION_STORAGE_USER_KEY = 'padelCurrentUser_v15';

export function ScoreboardProvider({ children }: { children: React.ReactNode }) {
  const [globalState, setGlobalState] = React.useState<GlobalState>(defaultState);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        setGlobalState(JSON.parse(storedState));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultState));
        setGlobalState(defaultState);
      }

      const storedUser = sessionStorage.getItem(SESSION_STORAGE_USER_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to initialize state from storage", e);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultState));
      setGlobalState(defaultState);
      sessionStorage.clear();
    }
    
    setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    if (!isInitialized) return;

    // This function syncs the state from localStorage.
    // It's used by both the event listener and the polling interval.
    const syncState = () => {
      try {
        const storedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedStateJSON) {
          // React's set-state function is smart enough to not cause a re-render
          // if the new state is identical to the current one.
          setGlobalState(JSON.parse(storedStateJSON));
        }
      } catch (e) {
        console.error("Failed to parse updated state from storage", e);
      }
    };
    
    // 1. Listen for changes from other tabs in real-time.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY) {
        syncState();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 2. Poll every 2 seconds as a fallback mechanism. This makes the sync very robust.
    const intervalId = setInterval(syncState, 2000);

    // Cleanup function to prevent memory leaks.
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [isInitialized]);

  const updateStateAndStorage = React.useCallback((updater: (prevState: GlobalState) => GlobalState) => {
    setGlobalState(currentState => {
        const newState = updater(currentState);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
            } catch(e) {
                console.error("Failed to save state to localStorage", e);
            }
        }
        return newState;
    });
  }, []);

  const setTheme = React.useCallback((theme: Theme) => {
    updateStateAndStorage(prev => ({ ...prev, theme }));
  }, [updateStateAndStorage]);

  const setAds = React.useCallback((ads: Ad[]) => {
    updateStateAndStorage(prev => ({ ...prev, ads }));
  }, [updateStateAndStorage]);

  const setUsers = React.useCallback((users: User[]) => {
    updateStateAndStorage(prev => ({ ...prev, users }));
  }, [updateStateAndStorage]);

  const login = React.useCallback((email: string, password: string): User | null => {
    const user = globalState.users.find(u => u.email === email && u.password === password && u.status === 'Active');
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem(SESSION_STORAGE_USER_KEY, JSON.stringify(user));
      return user;
    }
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_STORAGE_USER_KEY);
    return null;
  }, [globalState.users]);

  const logout = React.useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_STORAGE_USER_KEY);
  }, []);
  
  const updateScoreboard = React.useCallback((id: string, updates: Partial<Scoreboard>) => {
    updateStateAndStorage(prev => {
        const newScoreboards = prev.scoreboards.map(sb => 
            sb.id === id ? { ...sb, ...updates } : sb
        );
        return { ...prev, scoreboards: newScoreboards };
    });
  }, [updateStateAndStorage]);

  const addScoreboard = React.useCallback((newScoreboardData: Omit<Scoreboard, 'id'>) => {
      updateStateAndStorage(prev => {
          const newScoreboard: Scoreboard = {
              id: `court-${Date.now()}`,
              ...newScoreboardData,
              servingTeam: 'teamA',
          };
          return {
              ...prev,
              scoreboards: [...prev.scoreboards, newScoreboard],
          };
      });
  }, [updateStateAndStorage]);

  const setServingTeam = React.useCallback((scoreboardId: string, team: 'teamA' | 'teamB') => {
    updateStateAndStorage(prev => ({
        ...prev,
        scoreboards: prev.scoreboards.map(sb => 
            sb.id === scoreboardId ? { ...sb, servingTeam: team } : sb
        ),
    }));
  }, [updateStateAndStorage]);

  const handleScoreChange = React.useCallback((scoreboardId: string, team: 'teamA' | 'teamB', change: 1 | -1) => {
    updateStateAndStorage(prev => {
      const newScoreboards = prev.scoreboards.map(sb => {
        if (sb.id !== scoreboardId) return sb;

        const scoreboardToUpdate = JSON.parse(JSON.stringify(sb));
        
        const s = scoreboardToUpdate.score;
        s.teamA.points = Number(s.teamA.points) || 0;
        s.teamA.games = Number(s.teamA.games) || 0;
        s.teamB.points = Number(s.teamB.points) || 0;
        s.teamB.games = Number(s.teamB.games) || 0;
        if (!s.sets) s.sets = [];

        const setsWonA = s.sets.filter(set => set.teamA > set.teamB).length;
        const setsWonB = s.sets.filter(set => set.teamB > set.teamA).length;
        if (setsWonA === 2 || setsWonB === 2) {
            return sb;
        }

        const score = scoreboardToUpdate.score;
        const opponent = team === 'teamA' ? 'teamB' : 'teamA';
        
        let myPoints = score[team].points;
        
        if (change === -1) {
          if (myPoints > 0) {
              score[team].points--;
          } else if (score[team].games > 0) {
              score[team].games--;
          }
          return scoreboardToUpdate;
        } 
        
        let gameWon = false;
        const theirPoints = score[opponent].points;

        if (myPoints === 3) {
          if (theirPoints <= 2) { gameWon = true; } 
          else if (theirPoints === 3) { score[team].points = 4; }
          else { score[opponent].points = 3; }
        } else if (myPoints === 4) {
          gameWon = true;
        } else {
          score[team].points++;
        }
        
        if (gameWon) {
          score[team].games++;
          score.teamA.points = 0;
          score.teamB.points = 0;

          const myGames = score[team].games;
          const theirGames = score[opponent].games;
          
          const isSetWon = (myGames >= 6 && myGames - theirGames >= 2) || myGames === 7;

          if (isSetWon && score.sets.length < 3) {
              score.sets.push({ teamA: score.teamA.games, teamB: score.teamB.games });
              score.teamA.games = 0;
              score.teamB.games = 0;
          }
        }
        
        return scoreboardToUpdate;
      });
      return { ...prev, scoreboards: newScoreboards };
    });
  }, [updateStateAndStorage]);

  const resetScore = React.useCallback((scoreboardId: string) => {
    updateStateAndStorage(prev => ({
        ...prev,
        scoreboards: prev.scoreboards.map(sb => {
            if (sb.id !== scoreboardId) return sb;
            return {
                ...sb,
                score: { teamA: { points: 0, games: 0 }, teamB: { points: 0, games: 0 }, sets: [] },
                timers: {
                    gameStartTime: null,
                    isGameRunning: false,
                    accumulatedTime: 0,
                    activeCountdown: { type: null, endTime: null },
                },
                servingTeam: 'teamA',
            };
        }),
    }));
  }, [updateStateAndStorage]);

  const handleGameTimer = React.useCallback((scoreboardId: string) => {
    updateStateAndStorage(prev => {
        const newScoreboards = prev.scoreboards.map(sb => {
            if (sb.id !== scoreboardId) return sb;
            
            const now = Date.now();
            const timers = { ...sb.timers };

            if (timers.isGameRunning) {
              const elapsedSinceLastStart = timers.gameStartTime ? (now - timers.gameStartTime) : 0;
              timers.isGameRunning = false;
              timers.accumulatedTime = (timers.accumulatedTime || 0) + elapsedSinceLastStart / 1000;
              timers.gameStartTime = null; 
            } else {
              timers.isGameRunning = true;
              timers.gameStartTime = now;
            }
            return { ...sb, timers };
        });
        return { ...prev, scoreboards: newScoreboards };
    });
  }, [updateStateAndStorage]);

  const startCountdown = React.useCallback((scoreboardId: string, type: 'serve' | 'warmup', duration: number) => {
    updateStateAndStorage(prev => ({
        ...prev,
        scoreboards: prev.scoreboards.map(sb => {
            if (sb.id !== scoreboardId) return sb;

            const timers = { ...sb.timers };
            if (timers.activeCountdown.type === type && timers.activeCountdown.endTime && timers.activeCountdown.endTime > Date.now()) {
                timers.activeCountdown = { type: null, endTime: null };
            } else {
                timers.activeCountdown = { type, endTime: Date.now() + duration };
            }
            return { ...sb, timers };
        }),
    }));
  }, [updateStateAndStorage]);

  const startServeTimer = React.useCallback((scoreboardId: string) => {
    startCountdown(scoreboardId, 'serve', 25 * 1000);
  }, [startCountdown]);

  const startWarmupTimer = React.useCallback((scoreboardId: string) => {
    startCountdown(scoreboardId, 'warmup', 5 * 60 * 1000);
  }, [startCountdown]);

  const value: ScoreboardContextType = {
    ...globalState,
    setTheme,
    setAds,
    setUsers,
    pointValues,
    currentUser,
    login,
    logout,
    updateScoreboard,
    handleScoreChange,
    resetScore,
    handleGameTimer,
    startServeTimer,
    startWarmupTimer,
    addScoreboard,
    setServingTeam,
    isInitialized,
  };

  return (
    <ScoreboardContext.Provider value={value}>
      {children}
    </ScoreboardContext.Provider>
  );
}

export function useScoreboard() {
  const context = React.useContext(ScoreboardContext);
  if (context === undefined) {
    throw new Error('useScoreboard must be used within a ScoreboardProvider');
  }
  return context;
}
