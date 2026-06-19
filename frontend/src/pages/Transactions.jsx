import { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { AuthContext } from "../context/AuthContext";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

const Transactions = () => {
  const { transactions, fetchTransactions, addTransaction, deleteTransaction, updateTransaction, resetAllTransactions, categories } =
    useContext(ExpenseContext);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  useEffect(() => {
    const defaultCategory = categories.find(
      (category) => category.type === type,
    );
    if (defaultCategory) {
      setCategoryId(defaultCategory._id);
    } else if (categories.length > 0) {
      setCategoryId(categories[0]._id);
    }
  }, [categories, type]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId && categories.length > 0) {
      alert("Please select a valid category before saving.");
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      type,
      category: categoryId || "Misc",
      date: new Date(),
      notes: "",
    };

    if (editId) {
      await updateTransaction(editId, payload);
    } else {
      await addTransaction(payload);
    }

    closeModal();
  };

  const openEditModal = (t) => {
    setEditId(t._id);
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setCategoryId(t.category?._id || t.category || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setTitle("");
    setAmount("");
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to delete all transactions? This cannot be undone.")) {
      resetAllTransactions();
    }
  };

  const availableCategories = categories.filter(
    (category) => category.type === type,
  );

  return (
    <div className="animate-fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          Transactions
          {transactions.length > 0 && (
            <button 
              onClick={handleResetAll}
              style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Reset All Transactions"
            >
              <AlertTriangle size={16} /> Reset All
            </button>
          )}
        </h1>
        <button className="btn-primary" onClick={() => { closeModal(); setShowModal(true); }}>
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "0", overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <th style={{ padding: "16px", color: "var(--text-secondary)" }}>
                Title
              </th>
              <th style={{ padding: "16px", color: "var(--text-secondary)" }}>
                Date
              </th>
              <th style={{ padding: "16px", color: "var(--text-secondary)" }}>
                Type
              </th>
              <th style={{ padding: "16px", color: "var(--text-secondary)" }}>
                Amount
              </th>
              <th style={{ padding: "16px", color: "var(--text-secondary)", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t._id}
                style={{ borderBottom: "1px solid var(--glass-border)" }}
              >
                <td style={{ padding: "16px" }}>{t.title}</td>
                <td style={{ padding: "16px", color: "var(--text-secondary)" }}>
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      background:
                        t.type === "income"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      color:
                        t.type === "income"
                          ? "var(--accent-green)"
                          : "var(--accent-red)",
                    }}
                  >
                    {t.type}
                  </span>
                </td>
                <td style={{ padding: "16px", fontWeight: "500" }}>
                  ${t.amount.toFixed(2)}
                </td>
                <td style={{ padding: "16px", textAlign: "right" }}>
                  <button 
                    onClick={() => openEditModal(t)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', marginRight: '12px' }}
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTransaction(t._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="glass-panel"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <h2 style={{ marginBottom: "24px" }}>{editId ? "Edit Transaction" : "Add Transaction"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  className="input-glass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Amount</label>
                <input
                  type="number"
                  className="input-glass"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Type</label>
                <select
                  className="input-glass"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ appearance: "none" }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="input-group">
                <label>Category</label>
                <select
                  className="input-glass"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {availableCategories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    availableCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
