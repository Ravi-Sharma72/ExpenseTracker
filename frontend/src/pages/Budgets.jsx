import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Budgets = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1>Budget Planning</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your monthly spending limits</p>
      </header>

      <div className="glass-panel">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ marginBottom: '16px' }} className="text-gradient">Coming Soon</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            The budget planning feature is currently under development. You will soon be able to set category limits and track your progress visually.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
