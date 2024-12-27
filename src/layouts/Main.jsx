import React from "react";

// rrd imports
import { useLoaderData, Outlet } from "react-router-dom";

// UI imports
import Navbar from "../Components/Navbar";

// Import fetchData helper
import { fetchData } from "../helpers";

// loader
/**
 * Loader function to fetch data for the main page.
 * @returns {Promise<object>} The combined data for the current user, budgets, and expenses.
 */
export async function mainLoader() {
  try {
    // Fetch the current user data from localStorage
    const userId = localStorage.getItem("userId");  // Assuming userId is stored in localStorage
    if (!userId) {
      // If no userId exists, it's the first-time user or a logged-out user
      return { currentUserName:userId, budgets: [], expenses: [] };
    }
    
    const currentUserName = userId ? await fetchData("users", userId) : null;  // Fetch the user data if userId is available
    
    // Fetch all budgets from the backend
    const budgets = await fetchData("budgets");  // Fetch all budgets
    
    // Fetch all expenses associated with the budgets (based on the budget IDs)
    const expenses = budgets.length
      ? await Promise.all(
          budgets.map((budget) => fetchData("expenses", budget.id))  // Fetch expenses for each budget
        )
      : [];  // If no budgets, no expenses to fetch
    
    // Flatten the array of expenses to combine them into a single list
    const flattenedExpenses = expenses.flat();

    // Fallback to "Guest" if no user is found
    const currentUserNameFallback = currentUserName?.name; 

    // Return the data to be used in the Dashboard component
    return {
      currentUserName: currentUserNameFallback,
      budgets,
      expenses: flattenedExpenses,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    
    // Return default data if there's an error
    return { currentUserName: "Guest", budgets: [], expenses: [] };
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
