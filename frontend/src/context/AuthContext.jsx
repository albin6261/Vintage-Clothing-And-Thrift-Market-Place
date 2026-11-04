import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('thrifted_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.warn('Session expired or invalid token');
      localStorage.removeItem('thrifted_token');
      localStorage.removeItem('thrifted_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data;
      localStorage.setItem('thrifted_token', token);
      localStorage.setItem('thrifted_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.name}`);
      return { success: true, user: loggedUser };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please verify credentials.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user: registeredUser } = res.data;
      localStorage.setItem('thrifted_token', token);
      localStorage.setItem('thrifted_user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      showToast(`Account created. Welcome to THRIFTED.`);
      return { success: true, user: registeredUser };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('thrifted_token');
    localStorage.removeItem('thrifted_user');
    setUser(null);
    showToast('Signed out successfully.');
  };

  const quickDemoLogin = async (roleName) => {
    if (roleName === 'admin') {
      return await login('admin@thrifted.com', 'admin123');
    } else if (roleName === 'seller') {
      return await login('kaito.vintage@tokyoarchive.jp', 'seller123');
    } else {
      return await login('clara@example.com', 'buyer123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller' || user?.role === 'admin',
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
