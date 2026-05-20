import api from '../api/axios'; 
import type { LoginRequest, AuthResponse, RegisterRequest, RegisterResponse } from '../types/auth';

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

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error comunicando el logout al backend", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userLastName');
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    const name = localStorage.getItem('userName');
    const lastName = localStorage.getItem('userLastName');
    const token = localStorage.getItem('token');

    if (!token) return null;

    return {
      name: name || '',
      lastName: lastName || ''
    };
  },

  register: async (Credentials: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', Credentials);
      return response.data;
    } catch (error) {
      console.error("Error registering user", error);
      throw error;
    }
  }

};