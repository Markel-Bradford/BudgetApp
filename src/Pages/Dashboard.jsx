import React, { useState, useEffect, useCallback } from "react";
import { fetchData } from "../helpers";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import AddBudgetForm from "../Components/AddBudgetForm";
import AddExpenseForm from "../Components/AddExpenseForm";
import BudgetItem from "../Components/BudgetItem";
import Expenses from "../Components/Expenses";
import Signin from "../Components/Signin";

/**
 * Dashboard component that displays the user data, budgets, and expenses.
 */
const Dashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to refresh budgets and expenses after actions
  const refreshBudgets = useCallback(
    async (opts = { retryOn401: true }) => {
      if (!user?.id) return;

      try {
        const updatedBudgets = await fetchData(`budgets/${user.id}`);
        const updatedExpenses = [];

        // Fetch expenses for each budget
        for (const budget of updatedBudgets) {
          const expenseList = await fetchData(`expenses/${budget._id}`);
          updatedExpenses.push(...expenseList);
        }

        setBudgets(updatedBudgets);
        setExpenses(updatedExpenses);
      } catch (error) {
        console.error("Failed to refresh budgets:", error);
        // If authentication failed, allow a single retry to handle cookie set race
        if (error.response?.status === 401) {
          if (opts.retryOn401) {
            // wait briefly for cookie propagation then retry once
            setTimeout(() => refreshBudgets({ retryOn401: false }), 300);
            return;
          }
          // After one retry, show an auth error but don't force logout to avoid redirect loops
          toast.error("Authentication required. Please sign in again.");
          return;
        }
        toast.error("Failed to refresh budgets and expenses.");
      }
    },
    [user?.id, logout]
  );

  // Fetch budgets when user is loaded
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        // allow a short delay after login so the auth cookie can be set
        await new Promise((res) => setTimeout(res, 250));
        await refreshBudgets();
      } catch (error) {
        setError("Error loading data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, refreshBudgets]);

  // Render Navbar and redirect to signin if not authenticated
  if (!authLoading && !user) {
    return <Signin />;
  }

  // Show error message if there's an issue loading data
  if (error) {
    return <div>{error}</div>;
  }

  // Render the loading screen until data is fetched
  if (loading) {
    return <div className='loadingSpinner'><img src="/BudgetApp/images/spinner.svg" className="spinner" alt="Loading spinner" /></div>;
  }

  return (
    <div>
      <Navbar userName={user?.name} />
      <div className="dashboard">
        <h1 className="welcome">
          Welcome, <span className="accent">{user.name}</span>
        </h1>
      <div className="grid-sm">
        {budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm
                userId={user.id}
                refreshBudgets={refreshBudgets}
              />
              <AddExpenseForm
                budgets={budgets}
                budgetsId={budgets.map((budget) => budget._id)}
                refreshBudgets={refreshBudgets}
              />
            </div>
            <h2 className="sectionTitle">Current Budgets</h2>
            <div className="currentBudgets">
              {budgets.map((budget) => (
                <BudgetItem
                  key={budget._id}
                  budget={budget}
                  expenses={expenses}
                  refreshBudgets={refreshBudgets}
                />
              ))}
            </div>
            <Expenses budgets={budgets} refreshBudgets={refreshBudgets} />
          </div>
        ) : (
          <div>
            <p id="getstarted">
              Take the first steps towards achieving financial freedom.
              Create a new budget!
            </p>
            <AddBudgetForm userId={user.id} refreshBudgets={refreshBudgets} />
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
