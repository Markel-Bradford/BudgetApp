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
      
      return []; // Return an empty array if there's an error status
    }
  } catch (error) {
    
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
    
    localStorage.setItem("userId", response.data._id);
    toast.success("User created successfully!");
  } catch (error) {
    
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
      
      localStorage.setItem("userId", response.data.id);
      toast.success("Login successful!");
      return response.data;
  } catch (error) {
      
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
    
    return response
  } catch (error) {
    
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
   
    return response
  } catch (error) {
    
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
    
    toast.error("Failed to delete item. Please try again.");
  }
};

/**
 * Delete an expense and update the corresponding budget's spent amount.
 * @param {string} expenseId - The ID of the expense to delete.
 * @param {string} budgetId - The ID of the budget that the expense belongs to.
 * @param {number} amount - The amount to decrement from the budget's spent amount.
 * @returns {Promise<void>}
 */
export const deleteExpenseAndUpdateBudget = async (expenseId, budgetId, amount) => {
  
  try {
    // Debugging line to check what expenseId is
    
    
    // Delete the expense and fetch the updated budget
    const {data : updatedBudget} = await axios.delete(`${BASE_URL}expenses/${expenseId}`);
    
    toast.success("Expense deleted successfully!");

    return updatedBudget;
  } catch (error) {
   
    toast.error("Failed to delete expense and update budget.");
  }
};

/**
 * Delete a budget from the database.
 * @param {string} budgetId - The ID of the budget to delete.
 * @returns {Promise<void>}
 */
export const deleteBudget = async (budgetId) => {
  
  try {
    // Debugging line to check what expenseId is
    
    
    // Delete the expense
    await axios.delete(`${BASE_URL}budgets/${budgetId}`);
    toast.success("Budget deleted successfully!");
    
  } catch (error) {
    
    toast.error("Failed to delete budget.");
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
