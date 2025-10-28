// Type definitions for mockApi.js

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  role: string;
  bets: Bet[];
}

export interface Match {
  id: number;
  teamA: string;
  teamB: string;
  date: string;
  odds: { [key: string]: number };
  result: string | null;
}

export interface MatchCategory {
  category: string;
  matches: Match[];
}

export interface Bet {
  id: number;
  userId: number | string;
  matchId: number;
  teamChosen: string;
  amount: number;
  status: string;
  date: string;
}

export interface Transaction {
  id: number;
  userId: number | string;
  date: string;
  type: string;
  amount: number;
  status: string;
}

export interface DashboardData {
  profile: {
    id: number | string;
    name: string;
    email: string;
    role: string;
  };
  wallet: {
    balance: number;
    currency: string;
  };
  transactions: Transaction[];
  bets: Bet[];
}

export interface LoginResponse {
  user: {
    id: number | string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface RegisterResponse {
  user: {
    id: number | string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface DepositResponse {
  wallet: {
    balance: number;
  };
  transaction: Transaction;
}

export interface WithdrawResponse {
  wallet: {
    balance: number;
  };
  transaction: Transaction;
}

export interface PlaceBetResponse {
  bet: Bet;
  wallet: {
    balance: number;
  };
}

export interface UpdateMatchResultResponse {
  match: Match;
}

// Function declarations
export function register(name: string, email: string, phone: string): Promise<RegisterResponse>;
export function login(email: string, otp: string): Promise<LoginResponse>;
export function getUserDashboard(userId: number | string): Promise<DashboardData>;
export function deposit(userId: number | string, amount: number): Promise<DepositResponse>;
export function withdraw(userId: number | string, amount: number): Promise<WithdrawResponse>;
export function getMatches(): Promise<MatchCategory[]>;
export function placeBet(userId: number | string, matchId: number, team: string, amount: number): Promise<PlaceBetResponse>;
export function getAdminData(): Promise<{ users: User[]; matches: MatchCategory[]; bets: Bet[]; transactions: Transaction[] }>;
export function updateMatchResult(matchId: number, winner: string): Promise<UpdateMatchResultResponse>;