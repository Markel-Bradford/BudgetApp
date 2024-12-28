import React from "react";

// rrd imports
import { useLoaderData, Outlet, Navigate } from "react-router-dom";

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
    const userId = localStorage.getItem("userId");
  
    // Fetch the user data if userId is available
    const currentUserName = userId ? await fetchData(`users/${userId}`) : null;  
    
    // Fetch all budgets from the backend
    const budgets = userId ? (await fetchData(`budgets/${userId}`)) : [];

    // Fetch all expenses associated with the budgets (based on the budget IDs)
    // Ensure each budget has an expenses array
    const updatedBudgets = await Promise.all(budgets.map(async (budget) => {
      try {
      // Fetch expenses for current budget
      const expenses = await fetchData(`expenses/${budget._id}`);
      return {
        ...budget,
        expenses: Array.isArray(expenses) ? expenses : []  // Ensure expenses is always an array
      };
    } catch (error) {
      console.error(`Error fetching expenses for budget ${budget._id}:`, error);
          return {
            ...budget,
            expenses: [], // Fallback to empty array if fetching expenses fails
          };
    }
    }));

    // Return the data to be used in the Dashboard component
    return {
      currentUserName,
      budgets: updatedBudgets,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    
    // Return default data if there's an error
    return { currentUserName: null, budgets: [] };
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
