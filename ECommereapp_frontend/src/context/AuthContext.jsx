import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios directly

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user'); // Role state to identify user role across the app

  // Axios instance with default configurations
  const api = axios.create({
    baseURL: 'https://ecommerse-assingment-backend.onrender.com', // Backend URL
    withCredentials: true, // Include cookies in requests
  });

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('role'); // Retrieve role from sessionStorage

    if (!userId) {
      setUser(null); // Clear user state if session expired
      setRole('user'); // Reset role to default
    } else if (userRole) {
      setRole(userRole); // Set role if available in sessionStorage
    }
  }, []);

  const signup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    const { userId } = response.data;
  
    // Store userId and role in sessionStorage
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('role', 'user'); // Default role for signup is 'user'
  
    setUser({ name, email, userId });
    setRole('user');
    return userId;
  };

  const login = async (email, password, _role = 'user') => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.message === 'Login successful') {
        const { userId, userRole } = _role;
        
        // Save userId and role in sessionStorage
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', userRole || 'user');

        // Update the state with the logged-in user and role
        setUser({ email, userId });
        setRole(userRole || 'user');

        return 'Login successful';
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      if (err.response?.data?.error === 'Account is suspended') {
        alert('Your account is suspended from further notice due to unusual activity');
      } else if (err.response?.data?.error === 'Account is blocked') {
        alert('Your account has been terminated');
      }
      console.error('Login error:', err.response?.data?.error || err.message);
      throw err;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setRole('user'); // Reset role on logout
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
  };

  const fetchUserName = async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data.name;
  };

  return (
    <AuthContext.Provider value={{ user, role, signup, login, logout, fetchUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth };
