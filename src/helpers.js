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
    
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
      return []; // Return an empty array if there's an error status
    }
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
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
    console.log(response.data);
    localStorage.setItem("userId", response.data._id);
    toast.success("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    toast.error("Failed to create user. Please try again.");
  }
};

/**
 * Log in a user by name and email.
 * @param {object} user - User credentials.
 * @returns {Promise<object>} The logged-in user data.
 */
export const loginUser = async (user) => {
  try {
      const response = await axios.get(`${BASE_URL}users/login`, {
          params: user,
      });
      console.log("Logged in user:", response.data);
      localStorage.setItem("userId", response.data.id);
      toast.success("Login successful!");
      return response.data;
  } catch (error) {
      console.error("Error logging in user:", error);
      toast.error("Login failed. Please try again.");
      throw error;
  }
};

/**
 * Create a new budget.
 * @param {object} budget - The budget data to be created.
 * @returns {Promise<void>}
 */
export const newBudget = async (budget) => {
  try {
    const response = await axios.post(`${BASE_URL}budgets`, budget);
    console.log("Budget Payload:", budget);
    return response
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
    const response = await axios.post(`${BASE_URL}expenses`, expense);
    console.log(response.data)
    return response
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
    if (type === "user") {
      // Remove userId from local storage to logout
      localStorage.removeItem("userId");
    } else {
      // Delete items from database
      await axios.delete(`${BASE_URL}${type}/${id}`);
      toast.success("Item deleted successfully!");
    }
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
export const updateSpentAmount = async (budgetId, expenseId) => {
  try {
    const expenses = await fetchData(`expenses/${budgetId}`);
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    await axios.patch(`${BASE_URL}budgets/${expenseId}`, { spent: totalSpent });
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
    "#2E3A87",  // Dark blue
    "#4A1F24",  // Dark red
    "#3A3A3A",  // Dark gray
    "#1B4D3E",  // Dark green
    "#5C2A9D",  // Dark purple
    "#2F4F4F",  // Dark slate gray
    "#B22222",  // Firebrick red
    "#A52A2A",  // Brown
    "#6A1B9A",  // Purple
    "#D32F2F",  // Red
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


/**
 * Validate a budget or expense input.
 * @param {object} input - The input data (e.g., { name, amount }).
 * @returns {boolean} - True if valid, false otherwise.
 */
export const validateInput = (input) => {
  if (
    !input.name ||
    typeof input.name !== "string" ||
    input.name.trim() === ""
  ) {
    toast.error("Invalid name. Please provide a valid name.");
    return false;
  }
  if (isNaN(input.amount) || input.amount <= 0) {
    toast.error("Invalid amount. Please enter a positive number.");
    return false;
  }
  return true;
};
