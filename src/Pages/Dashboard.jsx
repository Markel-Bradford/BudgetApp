import React, { useState, useEffect } from "react";
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
  const [userData, setUserData] = useState({ currentUserName: "Guest", budgets: [], expenses: [] });

  useEffect(() => {
    // Initialize the app and fetch the user data based on login status
    const loadData = async () => {
      const data = await mainLoader();
      setUserData(data); // Set the user data once fetched
    };

    loadData(); // Call the initialization on component mount
  }, []);

  const {currentUserName, budgets, expenses} = userData; // Destructure user data
  console.log("Current User:", currentUserName);
  console.log("Current User ID:", currentUserName._id);
  console.log("Current budgets:", budgets);
  budgets.map((budget) => console.log("Budget ID:", budget._id));
  return (
<>
{currentUserName ? (
    <div className="dashboard">
      <h1 className="welcome">Welcome, <span className="accent">{currentUserName.name}</span></h1>
      <div className="grid-sm">
        {budgets.length > 0 ? ( 
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm userId={currentUserName.id}/>
              <AddExpenseForm budgets={budgets} budgetsId={budgets.map((budget) => budget._id)}/>
            </div>
            <h2 className="sectionTitle">Current Budgets</h2>
            <div className="currentBudgets">
              {budgets.map((budget) => (
                <BudgetItem key={budget._id} budget={budget} expenses={expenses} />
              ))}
            </div>
            
            <Expenses budgets={budgets} />
          </div>
        ) : (
          <div>
            <p id="getstarted">Take the first steps towards achieving financial freedom. Create a new budget!</p>
            <AddBudgetForm userId={currentUserName.id}/>
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
