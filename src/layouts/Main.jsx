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
  const userId = localStorage.getItem("userId") || null;
  const budgetId = null; // Adjust or retrieve dynamically from route or state

  // Attempt to fetch the data from backend
  const userData = userId ? await fetchData("users", userId) : null; // Calls `/api/users/:userId`
  const budgets = await fetchData("budgets") // Calls `/api/budgets/`
  const budgetDetails = await fetchData("budgets", budgetId); // Calls `/api/budgets/:budgetId`
  const expenses = await fetchData("expenses", budgetId); // Calls `/api/expenses/:budgetId`
  
  // Fallback to Budgets.user if localStorage is not popluated
  const currentUserName = userData?.name || "Guest";

  return { currentUserName, budgets, budgetDetails, expenses };
} catch (error) {
  console.error("Error loading data:", error);
  return {currentUserName: "Guest", budgets: [], expenses: []};
}
}

const Main = () => {
  const { currentUserName } = useLoaderData();


  return (
    <div className="layout">
      <Navbar userName={ currentUserName }/>
      <main>
        <Outlet context={{budgets, budgetDetails, expenses}}/>
        </main>
    </div>
  );
};

export default Main;
