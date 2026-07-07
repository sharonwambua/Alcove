import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('alcove_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  const saveUserSession = (userData) => {
    setUser(userData);
    localStorage.setItem('alcove_user', JSON.stringify(userData));
  };

  const login = async (identifier, password, role = 'tenant') => {
    setAuthLoading(true);
    try {
      if (role === 'tenant') {
        const response = await fetch(`${API_BASE_URL}/auth/tenant-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const result = await response.json();

        if (!result.success) {
          setAuthLoading(false);
          return { success: false, message: result.message || 'Invalid tenant credentials.' };
        }

        const tenantUser = { ...result.user, role: 'tenant' };
        saveUserSession(tenantUser);
        setAuthLoading(false);
        return { success: true, role: 'tenant', user: tenantUser };
      }

      const parsedId = identifier.trim().toLowerCase();
      if (parsedId.includes('@') && password.length >= 6) {
        const landlordUser = {
          id: 'LL-' + Math.floor(Math.random() * 900 + 100),
          name: 'Registered Property Manager',
          email: parsedId,
          role: 'landlord'
        };
        saveUserSession(landlordUser);
        setAuthLoading(false);
        return { success: true, role: 'landlord', user: landlordUser };
      }

      setAuthLoading(false);
      return { success: false, message: 'Invalid credentials. Please try again.' };
    } catch (error) {
      setAuthLoading(false);
      return { success: false, message: 'Server connection error. Is the backend running?' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alcove_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, saveUserSession, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be called inside an AuthProvider wrapper');
  }
  return context;
};
