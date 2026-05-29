import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    try {
      const data = await authService.login(userData);
      if (data.success) {
        setUser(data.data);
        return data;
      }
      throw new Error(data.error?.message || data.message || 'Login failed');
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Login failed';
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success) {
        setUser(data.data);
        return data;
      }
      throw new Error(data.error?.message || data.message || 'Registration failed');
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
