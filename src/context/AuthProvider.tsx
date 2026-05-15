import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext'; 
import type { User } from '../types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const name = localStorage.getItem('userName');
    const lastName = localStorage.getItem('userLastName');
    const token = localStorage.getItem('token');
    return (token && name && lastName) ? { name, lastName } : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userLastName', userData.lastName);
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};