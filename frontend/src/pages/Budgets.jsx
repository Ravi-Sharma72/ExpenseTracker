import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';

const Budgets = () => {
  const { user } = useContext(AuthContext);
  const { budgets, transactions, categories, setBudget } = useContext(ExpenseContext);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');

  if (!user) return null;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!categoryId) return;
    setBudget({ category: categoryId, amount: parseFloat(amount), month: currentMonth, year: currentYear });
    setAmount('');
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1>Budget Planning</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your monthly spending limits</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px' }}>Set Budget</h3>
          <form onSubmit={handleAddBudget}>
            <div className="input-group">
              <label>Category</label>
              <select className="input-glass" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                <option value="">Select Category</option>
                {expenseCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Amount Limit</label>
              <input type="number" className="input-glass" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Budget</button>
          </form>
        </div>

        <div className="glass-panel" style={{ flex: 2 }}>
          <h3 style={{ marginBottom: '24px' }}>Current Month Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {budgets.map(b => {
              if (b.month !== currentMonth || b.year !== currentYear) return null;
              const spent = transactions
                .filter(t => t.type === 'expense' && t.category && t.category._id === b.category._id && new Date(t.date).getMonth() + 1 === currentMonth)
                .reduce((acc, t) => acc + t.amount, 0);
              
              const percentage = Math.min((spent / b.amount) * 100, 100);
              const color = percentage >= 100 ? 'var(--accent-red)' : percentage > 80 ? '#f59e0b' : 'var(--accent-green)';

              return (
                <div key={b._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>{b.category.name}</span>
                    <span>${spent.toFixed(2)} / ${b.amount.toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
              );
            })}
            {budgets.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No budgets set for this month.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
