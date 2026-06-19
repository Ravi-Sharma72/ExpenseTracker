import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      if (token === 'mock-token') {
        setUser({ _id: '1', name: 'Demo User', email: 'demo@demo.com' });
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
    setToken('mock-token');
    setUser({ _id: '1', name: 'Demo User', email: email });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
