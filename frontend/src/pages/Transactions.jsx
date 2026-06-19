import { useContext, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Transactions = () => {
  const { transactions, addTransaction } = useContext(ExpenseContext);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  
  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, category should be selectable from DB categories
    // For simplicity, passing a placeholder or omitting if backend allows, 
    // actually backend requires category ObjectId. We need to fetch categories.
    // For now, let's mock it or just show UI structure.
    setShowModal(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Transactions</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Type</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px' }}>{t.title}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: t.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)'
                  }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ padding: '16px', fontWeight: '500' }}>
                  ${t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" className="input-glass" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Amount</label>
                <input type="number" className="input-glass" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Type</label>
                <select className="input-glass" value={type} onChange={e => setType(e.target.value)} style={{ appearance: 'none' }}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
