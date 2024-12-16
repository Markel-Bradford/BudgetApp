import React from "react";

// rrd imports
import { useLoaderData, Outlet } from "react-router-dom";

// UI imports
import Navbar from "../Components/Navbar";
import { Budgets } from "../Data/Budgets";

// loader
export function mainLoader() {
  // Attempt to fetch the data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedBudgets = JSON.parse(localStorage.getItem("budget")) || [];
  const storedExpenses = JSON.parse(localStorage.getItem("expense")) || [];
  
  // Fallback to Budgets.user if localStorage is not popluated
  const currentUserName = storedUser || Budgets.user?.[0]?.userName || "Guest"; // Fallback to guest if username is not entered

  return { currentUserName, storedBudgets, storedExpenses };
}

const Main = () => {
  const { currentUserName } = useLoaderData();


  return (
    <div className="layout">
      <Navbar userName={ currentUserName }/>
      <main>
        <Outlet />
        </main>
    </div>
  );
};

export default Main;
