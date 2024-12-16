import React, { useState } from "react";
import { useLoaderData, Form } from "react-router-dom";
import { fetchData, newBudget, wait, newExpense } from "../helpers";
import Signin from "../Components/Signin";
import { toast } from "react-toastify";
import AddBudgetForm from "../Components/AddBudgetForm";
import AddExpenseForm from "../Components/AddExpenseForm";
import BudgetItem from "../Components/BudgetItem";
import Expenses from "../Components/Expenses";
import { Budgets } from "../Data/Budgets";

//Dashboard loader
export function dashboardLoader() {
  const userName = fetchData("user");
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");
  return { userName, budgets, expenses };
}

// Actions
export async function dashboardAction({ request }) {
  await wait();

  const data = await request.formData();
  // Separates out the actions by the value to prevent repetively creating actions
  const { _action, ...values } = Object.fromEntries(data);
  //Stores the user input in the user array on form submission
  if (_action === "newUser") {
    try {
      if(!Budgets.user) {
        Budgets.user =[];
      }

      // Add net user to the array
      Budgets.user.push({ userName: values.userName})

      // Save user to the local storage
      localStorage.setItem("user", JSON.stringify(values.userName))

      return toast.success(`Welcome, ${values.userName}`);
    } catch (e) {
      console.error("Error adding new user:", e)
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "newBudget") {
    try {
      // Call newBudget function from helpers. Pass values into the function
      newBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      return toast.success("Budget created successfully!");
    } catch (e) {
      throw new Error("There was a problem creating your budget.");
    }
  }
  if (_action === "newExpense") {
    try {
      newExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetsId: values.budgetSelect,
      });
      return toast.success(`New expense ${values.newExpense} was added!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }
}



const Dashboard = () => {
  const { userName, budgets, expenses } = useLoaderData();

  // Use React state to manage budgets and expenses dynamically
  const [budget, setBudget] = useState(budgets);
  const [expense, setExpense] = useState(expenses);

  const currentUserName = Budgets.user?.[0]?.userName || userName || null ; // Check Budgets.user first, fallback to loader data

  const refreshBudgets = () => {
    const updatedBudgets = fetchData("budgets") || [];
    const updatedExpenses = fetchData("expenses") || [];
    setBudget(updatedBudgets);
    setExpense(updatedExpenses);
  };


  return (
    <>
      {currentUserName ? (
        <div className="dashboard">
          <h1 className="welcome">
            Welcome, <span className="accent">{currentUserName}.</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} refreshBudgets={refreshBudgets}/>
                </div>
                <h2 className="sectionTitle">Current Budgets</h2>
                <div className="currentBudgets">
                  {budgets.map((budgetItem) => (
                    <BudgetItem key={budgetItem.id} budgets={budgetItem} expenses={expense}/>
                  ))}
                </div>
                <Expenses budgets={budget} refreshBudgets={refreshBudgets}/>
              </div>
            ) : (
              <div>
                <p id="getstarted">
                  Take the first steps towards achieving financial freedom.{" "}
                  <br />
                  Create a new budget to get started!
                </p>
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
