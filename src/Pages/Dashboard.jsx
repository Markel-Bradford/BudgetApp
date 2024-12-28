import React, { useState, useEffect, useCallback } from "react";
import { fetchData } from "../helpers";
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
  const [userData, setUserData] = useState({
    currentUserName: null,
    budgets: [],
    expenses: [],
  });
  const [refreshedBudgets, setRefreshedBudgets] = useState([]);
  const [refreshedExpenses, setRefreshedExpenses] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // To track any errors

  // Function to refresh budgets and expenses after actions
  const refreshBudgets = useCallback(async () => {
    if (!userData.currentUserName?.id) return;

    try {
      const updatedBudgets = await fetchData(`budgets/${userData.currentUserName.id}`);
      const updatedExpenses = [];

      // Fetch expenses for each budget
      for (const budget of updatedBudgets) {
        const expenses = await fetchData(`expenses/${budget._id}`);
        updatedExpenses.push(...expenses);
      }

      // Update the state with refreshed data
      setRefreshedBudgets(updatedBudgets);
      setRefreshedExpenses(updatedExpenses);
    } catch (error) {
      toast.error("Failed to refresh budgets and expenses.");
      console.error("Error refreshing data:", error);
      setError("Failed to refresh data.");
    }
  }, [userData.currentUserName?.id]);

  useEffect(() => {
    // Initialize the app and fetch the user data based on login status
    const loadData = async () => {
      setLoading(true); // Start loading while fetching the data
      setError(null); // Reset any previous error
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setUserData({ currentUserName: null, budgets: [], expenses: [] });
          setLoading(false); // Stop loading if no userId
          return;
        }

        const fetchedUser = await fetchData(`users/${userId}`);
        const fetchedBudgets = await fetchData(`budgets/${userId}`);

        setUserData({ currentUserName: fetchedUser, budgets: fetchedBudgets });
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error loading data. Please try again later.");
        setLoading(false); // Stop loading if there’s an error
      }
    };

    loadData(); // Call the initialization on component mount
  }, []);

  useEffect(() => {
    if (userData.currentUserName?.id) {
      refreshBudgets(); // Refresh only when user is present
    }
  }, [userData.currentUserName?.id, refreshBudgets]);

  const { currentUserName } = userData; // Destructure user data

  // Show error message if there's an issue loading data
  if (error) {
    return <div>{error}</div>;
  }

  // Render the loading screen until data is fetched
  if (loading) {
    return <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}><img src="/BudgetApp/images/spinner.svg" style={{"width": "30%", "display": "flex"}} alt="Loading spinner" /></div>;
  }

  return (
    <>
      {currentUserName ? (
        <div className="dashboard">
          <h1 className="welcome">
            Welcome, <span className="accent">{currentUserName.name}</span>
          </h1>
          <div className="grid-sm">
            {refreshedBudgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm
                    userId={currentUserName.id}
                    refreshBudgets={refreshBudgets}
                  />
                  <AddExpenseForm
                    budgets={refreshedBudgets}
                    budgetsId={refreshedBudgets.map((budget) => budget._id)}
                    refreshBudgets={refreshBudgets}
                  />
                </div>
                <h2 className="sectionTitle">Current Budgets</h2>
                <div className="currentBudgets">
                  {refreshedBudgets.map((budget) => (
                    <BudgetItem
                      key={budget._id}
                      budget={budget}
                      expenses={refreshedExpenses}
                      refreshBudgets={refreshBudgets}
                    />
                  ))}
                </div>
                <Expenses budgets={refreshedBudgets} refreshBudgets={refreshBudgets} />
              </div>
            ) : (
              <div>
                <p id="getstarted">
                  Take the first steps towards achieving financial freedom.
                  Create a new budget!
                </p>
                <AddBudgetForm userId={currentUserName.id} refreshBudgets={refreshBudgets} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Signin />
      )}
    </>
  );
};

export default Dashboard;
