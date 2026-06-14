import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('alcove_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  const login = async (tenantIdOrEmail, password) => {
    setAuthLoading(true);
    try {
      const parsedId = tenantIdOrEmail.trim().toLowerCase();
      if (parsedId.startsWith('alc') && password === 'password123') {
        const tenantUser = {
          id: tenantIdOrEmail,
          name: 'Jane Mutoni',
          role: 'tenant',
          unit: 'Apartment 3B, Amani Gardens'
        };
        setUser(tenantUser);
        localStorage.setItem('alcove_user', JSON.stringify(tenantUser));
        setAuthLoading(false);
        return { success: true, role: 'tenant' };
      }

     
      if (
        (parsedId === 'landlord@alcove.com' && password === 'password123') || 
        (parsedId.includes('@') && password.length >= 6)
      ) {
        const landlordUser = {
          id: 'LL-' + Math.floor(Math.random() * 900 + 100),
          name: 'Registered Property Manager',
          role: 'landlord'
        };
        setUser(landlordUser);
        localStorage.setItem('alcove_user', JSON.stringify(landlordUser));
        setAuthLoading(false);
        return { success: true, role: 'landlord' };
      }

      setAuthLoading(false);
      return { success: false, message: 'Invalid credentials. Please try again.' };
    } catch (error) {
      setAuthLoading(false);
      return { success: false, message: 'Server connection error.' };
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('alcove_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
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