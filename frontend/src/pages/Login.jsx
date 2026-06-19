import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(email, password);
      if (success) navigate('/');
      else alert('Login failed');
    } else {
      // Handle registration
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        await login(email, password);
        navigate('/');
      } else {
        alert('Registration failed');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }} className="text-gradient">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Name</label>
              <input 
                type="text" 
                className="input-glass" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-glass" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-glass" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
