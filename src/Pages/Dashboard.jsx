import React from "react";
import { useLoaderData, Form } from "react-router-dom";
import { fetchData, newBudget, wait, newExpense } from "../helpers";
import Signin from "../Components/Signin";
import { toast } from "react-toastify";
import AddBudgetForm from "../Components/AddBudgetForm";
import AddExpenseForm from "../Components/AddExpenseForm";
import BudgetItem from "../Components/BudgetItem";

//Dashboard loader
export function dashboardLoader() {
  const userName = fetchData("userName");
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
  //Stores the user input in the local storage
  if (_action === "newUser") {
    try {
      localStorage.setItem("userName", JSON.stringify(values.userName));
      return toast.success(`Welcome, ${values.userName}`);
    } catch (e) {
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

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1 className="welcome">
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2 className="sectionTitle">Current Budgets</h2>
                <div className="currentBudgets">
                  {budgets.map((budgets) => (
                    <BudgetItem key={budgets.id} budgets={budgets} expenses={expenses}/>
                  ))}
                </div>
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
