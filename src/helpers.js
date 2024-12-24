const BASE_URL = "https://budgetapp-37rv.onrender.com/api"; // Base URL for backend API

export const wait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

const generateRandomColor = () => {
  const existingBudgetsLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetsLength * 34} 65% 50%`;
};

// Helper to fetch data from backend
export async function fetchData(endPoint, queryParam = "") {
  try {
    // Construct URL dynamically
    const url = queryParam
      ? `${BASE_URL}/${endPoint}/${queryParam}`
      : `${BASE_URL}/${endPoint}`;

    // Fetch data from API
    const response = await fetch(url);

    // Handle NOK responses
    if (!response.ok) {
      throw new Error(
        `Error fetching data from ${url}: ${response.statusText}`
      );
    }

    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
}

// Helper to send data to backend
async function postData(endPoint, data) {
  try {
    const response = await fetch(`${BASE_URL}/${endPoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error creating data.");
    return await response.json();
  } catch (error) {
    console.error("POST error:", error.message);
    return null;
  }
}

// Helper to delete data from backend
async function deleteData(endPoint, id) {
  try {
    const response = await fetch(`${BASE_URL}/${endPoint}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error deleting data.");
    return await response.json();
  } catch (error) {
    console.error("DELETE error:", error.message);
    return null;
  }
}

// Create new user and post on backend
export const newUser = async ({ userName }) => {
  const newUser = { userName };
  const result = await postData("users", newUser);
  return result;
};

// Create new budget
export const newBudget = async ({ name, amount }) => {
  const newItem = {
    name,
    createdAt: Date.now(),
    amount: +amount,
    spent: 0, // Initialize spent amount
    color: generateRandomColor(),
  };
  const result = await postData("budgets", newItem);
  return result;
};

// Create a new expense
export const newExpense = async (
  { name, amount, budgetsId },
  refreshBudgets
) => {
  const newItem = {
    name,
    createdAt: Date.now(),
    amount: +amount,
    budgetsId,
  };
  const result = await postData("expense", newItem);
  return result;
};

// Function to update the spent amount for a specific budget
export const updateSpentAmount = async (budgetId) => {
  const expenses = await fetchData("expenses", budgetId);
  if (!expenses) return;

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Send updates to the backend
  await postData(`budgets/update-spent`, { budgetId, spent: totalSpent });
};

// Delete item
export const deleteItem = async ({ type, id }) => {
  const endPointMap = {
    user: "users",
    budgets: "budgets",
    expenses: "expenses",
  };

  const endpoint = endPointMap[type];
  if (!endpoint) {
    console.warn("Invalid type:", type);
    return;
  }

  await deleteData(endpoint, id);
};

// Fetch all necessary data during app initialization
export const initializeData = async () => {
  const users = await fetchData("users");
  const budgets = await fetchData("budgets");
  const expenses = await fetchData("expenses");

  return { users, budgets, expenses };
};
