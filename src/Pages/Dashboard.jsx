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

  // Actions
  export async function dashboardAction({ request }) {
     
    const data = await request.formData();
    // Separates out the actions by the value to prevent repetively creating actions
    const { _action, ...values } = Object.fromEntries(data);
    //Stores the user input in the user array on form submission
     try {
      if (_action === "newBudget") {
        // Call newBudget function from helpers. Pass values into the function
        await newBudget({
          name: values.newBudget,
          amount: parseFloat(values.newBudgetAmount),
        });
        toast.success("Budget created successfully!");
        } else if (_action === "newExpense") {
      
        await newExpense({
          name: values.newExpense,
          amount: values.newExpenseAmount,
          budgetsId: values.budgetSelect,
        });
        toast.success(`New expense ${values.newExpense} was added!`);
        }
      } catch (e) {
        console.error(e)
        toast.error("There was a problem creating your expense.");
        return {error: e.message}
      }
    }



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

  return (
<>
{currentUserName ? (
    <div className="dashboard">
      <h1 className="welcome">Welcome, <span className="accent">{currentUserName.name}</span></h1>
      <div className="grid-sm">
        {budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm userId={currentUserName._id}/>
              <AddExpenseForm budgets={budgets}/>
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
            <AddBudgetForm userId={currentUserName._id}/>
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
