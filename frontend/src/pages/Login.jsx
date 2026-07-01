import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [viewState, setViewState] = useState('login'); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewState === 'login') {
      const result = await login(email, password);
      if (result.success) navigate('/');
      else alert(result.message);
    } else if (viewState === 'register') {
      // Handle registration
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/');
      } else {
        alert(result.message);
      }
    } else if (viewState === 'forgot') {
      const result = await resetPassword(email, password);
      if (result.success) setViewState('login');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }} className="text-gradient">
          {viewState === 'login' ? 'Welcome Back' : viewState === 'register' ? 'Create Account' : 'Reset Password'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {viewState === 'register' && (
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
            <label>{viewState === 'forgot' ? 'New Password' : 'Password'}</label>
            <input 
              type="password" 
              className="input-glass" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {viewState === 'login' ? 'Login' : viewState === 'register' ? 'Sign Up' : 'Reset Password'}
          </button>
        </form>
        
        {viewState === 'login' && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setViewState('forgot')}>
            Forgot Password?
          </p>
        )}
        
        <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setViewState(viewState === 'login' ? 'register' : 'login')}>
          {viewState === 'login' ? "Don't have an account? Sign Up" : "Back to Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
