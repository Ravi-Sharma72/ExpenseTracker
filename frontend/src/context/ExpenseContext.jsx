import { createContext, useState, useContext, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/transactions", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/categories", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchBudgets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/budgets", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setBudgets(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const addTransaction = async (txData) => {
    const res = await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(txData),
    });
    if (res.ok) { 
      const data = await res.json(); 
      setTransactions((prev) => [data, ...prev]); 
    } else {
      throw new Error("Failed to add transaction");
    }
  };

  const deleteTransaction = async (id) => {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } else {
      throw new Error("Failed to delete transaction");
    }
  };

  const resetAllTransactions = async () => {
    const res = await fetch(`/api/transactions/reset`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      setTransactions([]);
    } else {
      throw new Error("Failed to reset transactions");
    }
  };

  const updateTransaction = async (id, txData) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(txData),
    });
    if (res.ok) { 
      const data = await res.json(); 
      setTransactions((prev) => prev.map((t) => (t._id === id ? data : t))); 
    } else {
      throw new Error("Failed to update transaction");
    }
  };

  const setBudget = async (budgetData) => {
    const res = await fetch("/api/budgets", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(budgetData),
    });
    if (res.ok) {
       const data = await res.json();
       setBudgets(prev => {
          const existing = prev.find(b => b.category._id === data.category._id && b.month === data.month && b.year === data.year);
          if (existing) return prev.map(b => b._id === existing._id ? data : b);
          return [...prev, data];
       });
    } else {
      throw new Error("Failed to set budget");
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
