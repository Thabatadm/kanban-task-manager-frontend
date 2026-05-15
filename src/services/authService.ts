import api from '../api/axios'; 
import type { LoginRequest, AuthResponse } from '../types/auth';

export const authService = {

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const authData = response.data;

      if (authData.token) {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('userName', authData.name);
        localStorage.setItem('userLastName', authData.lastName);
      }

      return authData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Auth Service Error:", error.message);
      }
      throw error; 
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLastName');

    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const name = localStorage.getItem('userName');
    const lastName = localStorage.getItem('userLastName');
    const token = localStorage.getItem('token');

    if (!token) return null;

    return {
      token,
      name: name || '',
      lastName: lastName || ''
    };
  }
};