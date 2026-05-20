export interface User {
  name: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  lastName: string;
  enabled: boolean;
  username: string; 
}