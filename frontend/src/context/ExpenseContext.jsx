import { createContext, useState, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const addTransaction = async (txData) => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(txData)
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions([data, ...transactions]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ExpenseContext.Provider value={{ transactions, fetchTransactions, addTransaction, categories, budgets }}>
      {children}
    </ExpenseContext.Provider>
  );
};
