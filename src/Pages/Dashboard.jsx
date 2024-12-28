import React, { useState, useEffect, useCallback } from "react";
import { useLoaderData } from "react-router-dom";
import { fetchData, newBudget, newExpense } from "../helpers";
import { toast } from "react-toastify";
import AddBudgetForm from "../Components/AddBudgetForm";
import AddExpenseForm from "../Components/AddExpenseForm";
import BudgetItem from "../Components/BudgetItem";
import Expenses from "../Components/Expenses";
import { mainLoader } from "../layouts/Main";
import Signin from "../Components/Signin";

/**
 * Dashboard component that displays the user data, budgets, and expenses.
 */
const Dashboard = () => {
  const [userData, setUserData] = useState({
    currentUserName: "Guest",
    budgets: [],
    expenses: [],
  });
  const [refreshedBudgets, setRefreshedBudgets] = useState([]);
  const [refreshedExpenses, setRefreshedExpenses] = useState([]);
  
  // Function to refresh budgets and expenses after actions
  const refreshBudgets = useCallback(async () => {
    try {
      const updatedBudgets = (await fetchData(`budgets/${userData.currentUserName.id}`)) || [];
      const updatedExpenses = [];
    for (const budget of updatedBudgets) {
      const expenses = await fetchData(`expenses/${budget._id}`);
      updatedExpenses.push(...expenses);
    }
      setRefreshedBudgets(updatedBudgets);
      setRefreshedExpenses(updatedExpenses);
    } catch (error) {
      toast.error("Failed to refresh budgets and expenses.");
      console.error("Error refreshing data:", error);
    }
  }, [userData.currentUserName?.id]);

  useEffect(() => {
    // Initialize the app and fetch the user data based on login status
    const loadData = async () => {
      const data = await mainLoader();
      console.log('Fetched data:', data); // Log the fetched data
      setUserData(data); // Set the user data once fetched
    };

    
    loadData(); // Call the initialization on component mount

    // Listen for storage changes
    const handleStorageChange = () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUserData({currentUserName: null, budgets: [], expenses: []})
      }
    };

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, []);

  useEffect(() => {
    if (userData.currentUserName.id) {
      refreshBudgets(); // Refresh only when user is present
    }
  }, [userData.currentUserName?.id]); // Trigger when user changes

  const { currentUserName, budgets, expenses } = userData; // Destructure user data
  
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
                    />
                  ))}
                </div>

                <Expenses budgets={refreshedBudgets || []} />
              </div>
            ) : (
              <div>
                <p id="getstarted">
                  Take the first steps towards achieving financial freedom.
                  Create a new budget!
                </p>
                <AddBudgetForm userId={currentUserName.id} />
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
