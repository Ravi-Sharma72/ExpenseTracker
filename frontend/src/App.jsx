import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <Router>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
