import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('fittrack_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fittrack_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const loadUser = async (storedToken = token) => {
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data?.data?.user || null;
      setCurrentUser(user);
      localStorage.setItem('fittrack_user', JSON.stringify(user));
    } catch (error) {
      localStorage.removeItem('fittrack_token');
      localStorage.removeItem('fittrack_user');
      setCurrentUser(null);
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser(token);
  }, [token]);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token: newToken, user } = response.data.data;
    localStorage.setItem('fittrack_token', newToken);
    localStorage.setItem('fittrack_user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const { token: newToken, user } = response.data.data;
    localStorage.setItem('fittrack_token', newToken);
    localStorage.setItem('fittrack_user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors and clear local state for the session.
    }

    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
    setToken('');
    setCurrentUser(null);
  };

  const value = useMemo(() => ({
    token,
    currentUser,
    loading,
    login,
    register,
    logout,
    setCurrentUser,
  }), [token, currentUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
