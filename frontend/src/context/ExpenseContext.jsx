import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef
} from "react";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

const initialMockTransactions = [
  { _id: '1', title: 'Salary', amount: 5000, type: 'income', date: new Date().toISOString(), category: { _id: 'cat1', name: 'Salary', color: '#10b981' } },
  { _id: '2', title: 'Groceries', amount: 150, type: 'expense', date: new Date().toISOString(), category: { _id: 'cat2', name: 'Food', color: '#3b82f6' } },
  { _id: '3', title: 'Internet Bill', amount: 60, type: 'expense', date: new Date(Date.now() - 86400000).toISOString(), category: { _id: 'cat3', name: 'Utilities', color: '#a855f7' } },
  { _id: '4', title: 'Dining Out', amount: 80, type: 'expense', date: new Date(Date.now() - 172800000).toISOString(), category: { _id: 'cat2', name: 'Food', color: '#3b82f6' } },
  { _id: '5', title: 'Freelance Project', amount: 1200, type: 'income', date: new Date(Date.now() - 259200000).toISOString(), category: { _id: 'cat4', name: 'Business', color: '#f59e0b' } },
];

const mockCategories = [
  { _id: 'cat1', name: 'Salary', type: 'income', color: '#10b981' },
  { _id: 'cat2', name: 'Food', type: 'expense', color: '#3b82f6' },
  { _id: 'cat3', name: 'Utilities', type: 'expense', color: '#a855f7' },
  { _id: 'cat4', name: 'Business', type: 'income', color: '#f59e0b' },
  { _id: 'cat5', name: 'Entertainment', type: 'expense', color: '#ec4899' },
  { _id: 'cat6', name: 'Transportation', type: 'expense', color: '#eab308' },
  { _id: 'cat7', name: 'Health', type: 'expense', color: '#ef4444' },
  { _id: 'cat8', name: 'Shopping', type: 'expense', color: '#06b6d4' },
];

const initialMockBudgets = [
  { _id: 'b1', category: { _id: 'cat2', name: 'Food', color: '#3b82f6' }, amount: 400, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
  { _id: 'b2', category: { _id: 'cat3', name: 'Utilities', color: '#a855f7' }, amount: 100, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
];

const getLocalMocks = (key, defaultMocks) => {
  const saved = localStorage.getItem(`mock_${key}`);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(`mock_${key}`, JSON.stringify(defaultMocks));
  return defaultMocks;
};

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { token } = useContext(AuthContext);
  const loadedMocks = useRef(false);

  // Sync to local storage on changes if using mocks
  useEffect(() => {
    if (loadedMocks.current) {
      localStorage.setItem('mock_transactions', JSON.stringify(transactions));
      localStorage.setItem('mock_budgets', JSON.stringify(budgets));
    }
  }, [transactions, budgets]);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/transactions", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else throw new Error("Backend error");
    } catch (err) {
      if (!loadedMocks.current) {
        setTransactions(getLocalMocks('transactions', initialMockTransactions));
        setBudgets(getLocalMocks('budgets', initialMockBudgets));
        loadedMocks.current = true;
      }
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/categories", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCategories(await res.json());
      else throw new Error("Backend error");
    } catch (err) {
      setCategories(mockCategories);
    }
  }, [token]);

  const fetchBudgets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/budgets", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setBudgets(await res.json());
      else throw new Error("Backend error");
    } catch (err) {
      // Mock budgets are handled in fetchTransactions along with transactions to avoid race conditions
    }
  }, [token]);

  const addTransaction = async (txData) => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(txData),
      });
      if (res.ok) { const data = await res.json(); setTransactions((prev) => [data, ...prev]); return; }
      throw new Error("Backend error");
    } catch (err) {
      const categoryObj = categories.find(c => c._id === txData.category) || { name: 'Misc', color: '#a855f7' };
      const newTx = { ...txData, _id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), amount: parseFloat(txData.amount), category: categoryObj };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setTransactions((prev) => prev.filter((t) => t._id !== id));
      else throw new Error("Backend error");
    } catch (err) {
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const resetAllTransactions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/reset`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setTransactions([]);
      else throw new Error("Backend error");
    } catch (err) {
      setTransactions([]);
    }
  };

  const updateTransaction = async (id, txData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(txData),
      });
      if (res.ok) { const data = await res.json(); setTransactions((prev) => prev.map((t) => (t._id === id ? data : t))); return; }
      throw new Error("Backend error");
    } catch (err) {
      const categoryObj = categories.find(c => c._id === txData.category) || { name: 'Misc', color: '#a855f7' };
      setTransactions((prev) => prev.map((t) => (t._id === id ? { ...t, ...txData, amount: parseFloat(txData.amount), category: categoryObj } : t)));
    }
  };

  const setBudget = async (budgetData) => {
    try {
      const res = await fetch("http://localhost:5000/api/budgets", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(budgetData),
      });
      if (res.ok) {
         const data = await res.json();
         setBudgets(prev => {
            const existing = prev.find(b => b.category._id === data.category._id && b.month === data.month && b.year === data.year);
            if (existing) return prev.map(b => b._id === existing._id ? data : b);
            return [...prev, data];
         });
         return;
      }
      throw new Error("Backend error");
    } catch (err) {
      const categoryObj = categories.find(c => c._id === budgetData.category);
      setBudgets((prev) => {
        const existing = prev.find(b => b.category._id === budgetData.category && b.month === budgetData.month && b.year === budgetData.year);
        if (existing) return prev.map(b => b._id === existing._id ? { ...b, amount: parseFloat(budgetData.amount) } : b);
        return [...prev, { _id: Math.random().toString(36).substr(2, 9), ...budgetData, amount: parseFloat(budgetData.amount), category: categoryObj }];
      });
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchTransactions();
    fetchCategories();
    fetchBudgets();
  }, [token, fetchTransactions, fetchCategories, fetchBudgets]);

  return (
    <ExpenseContext.Provider value={{ transactions, fetchTransactions, addTransaction, deleteTransaction, updateTransaction, resetAllTransactions, categories, budgets, fetchCategories, setBudget }}>
      {children}
    </ExpenseContext.Provider>
  );
};
