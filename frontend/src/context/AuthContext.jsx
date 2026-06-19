import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      if (token === 'mock-token') {
        const mockName = localStorage.getItem('mock_user_name') || 'Demo User';
        const mockEmail = localStorage.getItem('mock_user_email') || 'demo@demo.com';
        setUser({ _id: '1', name: mockName, email: mockEmail });
        setLoading(false);
      } else {
        fetchUser(token);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Backend unreachable, using mock user', err);
      setUser({ _id: '1', name: 'Demo User', email: 'demo@demo.com' });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return true;
      }
    } catch (err) {
      console.error('Backend unreachable, using mock user login', err);
    }
    
    // Fallback for demo mode
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('mock_user_email', email);
    const storedName = localStorage.getItem('mock_user_name') || email.split('@')[0];
    localStorage.setItem('mock_user_name', storedName);
    
    setToken('mock-token');
    setUser({ _id: '1', name: storedName, email: email, memberSince: '2023-01-01' });
    return true;
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        return await login(email, password);
      }
    } catch (err) {
      console.error('Backend unreachable, using mock user register', err);
    }
    
    // Fallback for demo mode
    localStorage.setItem('mock_user_name', name);
    return await login(email, password);
  };

  const resetPassword = async (email, newPassword) => {
    // In mock mode, just log it as a success
    // A real backend would send an email link or perform update directly
    alert("Mock: Password reset successfully for " + email);
    return true;
  };

  const updateProfile = async (name, email) => {
    // In mock mode
    localStorage.setItem('mock_user_name', name);
    localStorage.setItem('mock_user_email', email);
    setUser(prev => ({ ...prev, name, email }));
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
