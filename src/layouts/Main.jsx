import React from "react";

// rrd imports
import { useLoaderData, Outlet } from "react-router-dom";

// UI imports
import Navbar from "../Components/Navbar";

// Import fetchData helper
import { fetchData } from "../helpers";

// loader
export async function mainLoader() {
  try {
  localStorage.setItem("userId", user.id); // Save the user ID returned from the backend
  const budgetId = null; // Adjust or retrieve dynamically from route or state

  // Attempt to fetch the data from backend
  const userData = userId ? await fetchData("users", userId) : null; // Calls `/api/users/:userId`
  const budgets = await fetchData("budgets") // Calls `/api/budgets/`
  const expenses = budgets.length // Calls `/api/expenses/:budgetId`
    ? await Promise.all(
      budgets.map((budget) => fetchData("expenses", budget.id))
    ) : [];

  // Combine all expenses
  const flattendExpenses = expenses.flat();


  // Fallback to Budgets.user if localStorage is not popluated
  const currentUserName = userData?.name || "Guest";

  return { currentUserName, budgets, expenses: flattendExpenses };
} catch (error) {
  console.error("Error loading data:", error);
  return {currentUserName: "Guest", budgets: [], expenses: []};
}
}

const Main = () => {
  const { currentUserName, budgets, expenses } = useLoaderData();


  return (
    <div className="layout">
      <Navbar userName={ currentUserName }/>
      <main>
        <Outlet context={{budgets, expenses}}/>
        </main>
    </div>
  );
};

export default Main;
