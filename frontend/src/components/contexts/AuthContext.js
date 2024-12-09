import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('userId'))
  );
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [name, setName] = useState(localStorage.getItem('name') || null);

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.post('https://qairline-t28f.onrender.com/api/users/login', {
        username,
        password,
      });
      const { user } = response.data;

      setIsAuthenticated(true);
      setUserId(user.userId);
      setName(user.name);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('name', user.name);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, username, password) => {
    try {
      const response = await axios.post('https://qairline-t28f.onrender.com/api/users', {
        name,
        username,
        password,
      });
      const { user } = response.data;

      setIsAuthenticated(true);
      setUserId(user._id);
      setName(user.name);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('name', user.name);

      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error.response?.data?.message || error.message);
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setName(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        name,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
