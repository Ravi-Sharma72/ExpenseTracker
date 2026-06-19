import { useContext, useEffect } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const { transactions, fetchTransactions } = useContext(ExpenseContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        fetchTransactions();
      }
    }
  }, [user, loading, navigate, fetchTransactions]);

  if (loading || !user) return null;

  // Calculate stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Chart data
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const catName = t.category ? t.category.name : "Unknown";
      acc[catName] = (acc[catName] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.keys(expensesByCategory).map((key) => ({
    name: key,
    value: expensesByCategory[key],
  }));

  const COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem" }}>
          Hello, <span className="text-gradient">{user.name}</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Here's your financial overview
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div className="glass-panel">
          <h3 style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
            Total Balance
          </h3>
          <h2 style={{ fontSize: "2.5rem" }}>${balance.toFixed(2)}</h2>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
            Total Income
          </h3>
          <h2 style={{ fontSize: "2rem", color: "var(--accent-green)" }}>
            +${totalIncome.toFixed(2)}
          </h2>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
            Total Expenses
          </h3>
          <h2 style={{ fontSize: "2rem", color: "var(--accent-red)" }}>
            -${totalExpense.toFixed(2)}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        <div className="glass-panel">
          <h3 style={{ marginBottom: "24px" }}>Expenses by Category</h3>
          {data.length > 0 ? (
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "var(--text-primary)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)" }}>No expenses yet.</p>
          )}
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: "24px" }}>Recent Transactions</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <h4 style={{ fontWeight: "500" }}>{t.title}</h4>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    color:
                      t.type === "income"
                        ? "var(--accent-green)"
                        : "var(--text-primary)",
                  }}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p style={{ color: "var(--text-secondary)" }}>
                No transactions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
