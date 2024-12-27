import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { fetchData } from "../helpers";
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
  const [userData, setUserData] = useState({ currentUserName: "Guest", budgets: [], expenses: [] });

  // React state for managing budgets and expenses dynamically
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  

  useEffect(() => {
    // Initialize the app and fetch the user data based on login status
    const loadData = async () => {
      const data = await mainLoader();
      setUserData(data); // Set the user data once fetched
    };

    loadData(); // Call the initialization on component mount
  }, []);


  return (
<>
{userData.currentUserName ? (
    <div className="dashboard">
      <h1 className="welcome">Welcome, <span className="accent">{userData.currentUserName}</span></h1>
      <div className="grid-sm">
        {budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm/>
              <AddExpenseForm budgets={budgets}/>
            </div>
            <h2 className="sectionTitle">Current Budgets</h2>
            <div className="currentBudgets">
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} expenses={expenses} />
              ))}
            </div>
            
            <Expenses budgets={budgets} />
          </div>
        ) : (
          <div>
            <p id="getstarted">Take the first steps towards achieving financial freedom. Create a new budget!</p>
            <AddBudgetForm />
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
