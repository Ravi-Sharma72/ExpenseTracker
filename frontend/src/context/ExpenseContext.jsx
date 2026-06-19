import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

const mockTransactions = [
  { _id: '1', title: 'Salary', amount: 5000, type: 'income', date: new Date().toISOString(), category: { name: 'Salary', color: '#10b981' } },
  { _id: '2', title: 'Groceries', amount: 150, type: 'expense', date: new Date().toISOString(), category: { name: 'Food', color: '#3b82f6' } },
  { _id: '3', title: 'Internet Bill', amount: 60, type: 'expense', date: new Date(Date.now() - 86400000).toISOString(), category: { name: 'Utilities', color: '#a855f7' } },
  { _id: '4', title: 'Dining Out', amount: 80, type: 'expense', date: new Date(Date.now() - 172800000).toISOString(), category: { name: 'Food', color: '#3b82f6' } },
  { _id: '5', title: 'Freelance Project', amount: 1200, type: 'income', date: new Date(Date.now() - 259200000).toISOString(), category: { name: 'Business', color: '#f59e0b' } },
];

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        throw new Error("Backend error");
      }
    } catch (err) {
      console.error("Backend unreachable, using mock transactions", err);
      setTransactions(mockTransactions);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const addTransaction = async (txData) => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(txData),
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions((prev) => [data, ...prev]);
        return;
      }
      throw new Error("Backend error");
    } catch (err) {
      console.error("Backend unreachable, saving to mock state", err);
      const newTx = {
        ...txData,
        _id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        amount: parseFloat(txData.amount),
        category: { name: txData.type === 'income' ? 'Misc Income' : 'Misc Expense', color: '#a855f7' }
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } else {
        throw new Error("Backend error");
      }
    } catch (err) {
      console.error("Backend unreachable, deleting from mock state", err);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const updateTransaction = async (id, txData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(txData),
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions((prev) => prev.map((t) => (t._id === id ? data : t)));
        return;
      }
      throw new Error("Backend error");
    } catch (err) {
      console.error("Backend unreachable, updating mock state", err);
      setTransactions((prev) => prev.map((t) => (t._id === id ? { ...t, ...txData, amount: parseFloat(txData.amount) } : t)));
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchTransactions();
    fetchCategories();
  }, [token, fetchTransactions, fetchCategories]);

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        categories,
        budgets,
        fetchCategories,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
