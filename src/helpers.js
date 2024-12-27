// helpers.js

// Import necessary libraries
import axios from "axios"; // Switched to Axios for improved error handling and cleaner API calls
import { toast } from "react-toastify";

// Constants
const BASE_URL = "https://budgetapp-37rv.onrender.com/api/"; // Base URL for API calls (modify as needed)

/**
 * Fetch data from the API.
 * @param {string} endpoint - The endpoint to fetch data from (e.g., "budgets" or "expenses").
 * @returns {Promise<any>} - The fetched data or null if an error occurs.
 */
export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    toast.error(`Failed to fetch ${endpoint}. Please try again.`);
    return null;
  }
};

/**
 * Create a new user.
 * @param {object} user - The user data to be created.
 * @returns {Promise<void>}
 */
export const newUser = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}users/register`, user);
    console.log(response.data)
    localStorage.setItem("userId", response.data._id)
    toast.success("User created successfully!");
    
  } catch (error) {
    console.error("Error creating user:", error);
    toast.error("Failed to create user. Please try again.");
  }
};

/**
 * Create a new budget.
 * @param {object} budget - The budget data to be created.
 * @returns {Promise<void>}
 */
export const newBudget = async (budget) => {
  try {
    await axios.post(`${BASE_URL}`, budget);
    toast.success("Budget created successfully!");
  } catch (error) {
    console.error("Error creating budget:", error);
    toast.error("Failed to create budget. Please try again.");
  }
};

/**
 * Create a new expense.
 * @param {object} expense - The expense data to be created.
 * @returns {Promise<void>}
 */
export const newExpense = async (expense) => {
  try {
    await axios.post(`${BASE_URL}`, expense);
    toast.success("Expense added successfully!");
  } catch (error) {
    console.error("Error creating expense:", error);
    toast.error("Failed to add expense. Please try again.");
  }
};

/**
 * Delete an item (budget or expense).
 * @param {object} params - The parameters including type (budgets/expenses) and id of the item.
 * @returns {Promise<void>}
 */
export const deleteItem = async ({ type, id }) => {
  try {
    await axios.delete(`${BASE_URL}${type}/${id}`);
    toast.success("Item deleted successfully!");
  } catch (error) {
    console.error(`Error deleting ${type} with id ${id}:`, error);
    toast.error("Failed to delete item. Please try again.");
  }
};

/**
 * Update the spent amount for a specific budget.
 * @param {string} budgetId - The ID of the budget to update.
 * @returns {Promise<void>}
 */
export const updateSpentAmount = async (budgetId) => {
  try {
    const expenses = await fetchData(`expenses?budgetId=${budgetId}`);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    await axios.patch(`${BASE_URL}budgets/${budgetId}`, { spent: totalSpent });
    toast.info("Spent amount updated!");
  } catch (error) {
    console.error("Error updating spent amount:", error);
    toast.error("Failed to update spent amount. Please try again.");
  }
};

/**
 * Format a number as currency (USD).
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Get a random color for budgets.
 * @returns {string} - A hex color code.
 */
export const getRandomColor = () => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#33FFF3", "#FF33F3", "#F333FF"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Validate a budget or expense input.
 * @param {object} input - The input data (e.g., { name, amount }).
 * @returns {boolean} - True if valid, false otherwise.
 */
export const validateInput = (input) => {
  if (!input.name || typeof input.name !== "string" || input.name.trim() === "") {
    toast.error("Invalid name. Please provide a valid name.");
    return false;
  }
  if (isNaN(input.amount) || input.amount <= 0) {
    toast.error("Invalid amount. Please enter a positive number.");
    return false;
  }
  return true;
};
