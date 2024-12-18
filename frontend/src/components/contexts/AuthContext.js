import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Config from '../../Config.js';

const AuthContext = createContext();
const apiBaseUrl = Config.apiBaseUrl;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('userId'))
  );
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [name, setName] = useState(localStorage.getItem('name') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null); 

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/login`, {
        username,
        password,
      });
      const { user } = response.data;

      setIsAuthenticated(true);
      setUserId(user.userId);
      setName(user.name);
      setRole(user.role); 

      localStorage.setItem('userId', user.userId);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, username, password, role = 'user') => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users`, {
        name,
        username,
        password,
        role,
      });
      const { user } = response.data;

      setIsAuthenticated(true);
      setUserId(user._id);
      setName(user.name);
      setRole(user.role); 

      localStorage.setItem('userId', user._id);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

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
    setRole(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('role'); 
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        name,
        role,
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
