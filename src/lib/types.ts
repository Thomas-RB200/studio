export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  'data-ai-hint'?: string;
}

export type UserRole = 'Hyper Admin' | 'Super Admin' | 'Admin' | 'Referee';

export interface User {
  id:string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  creatorId?: string;
}

export interface Theme {
  scoreboardTitle: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundType: 'color' | 'image';
  backgroundImage: string | null;
}

export interface TimerState {
  gameStartTime: number | null;
  isGameRunning: boolean;
  accumulatedTime: number; // in seconds
  activeCountdown: {
    type: 'serve' | 'warmup' | null;
    endTime: number | null;
  };
}

export interface SetScore {
  teamA: number;
  teamB: number;
}

export interface Scoreboard {
  id: string;
  courtName: string;
  refereeId: string | null;
  isActive: boolean;
  teams: {
    teamA: string;
    teamB: string;
  };
  score: {
    teamA: { points: number; games: number; };
    teamB: { points: number; games: number; };
    sets: SetScore[]; // array of finished set scores
  };
  timers: TimerState;
}

export interface GlobalState {
  theme: Theme;
  ads: Ad[];
  users: User[];
  scoreboards: Scoreboard[];
}
