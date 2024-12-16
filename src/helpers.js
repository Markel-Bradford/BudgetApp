import { Budgets } from "./Data/Budgets";

export const wait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

const generateRandomColor = () => {
  const existingBudgetsLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetsLength * 34} 65% 50%`;
};

export const fetchData = (key) => {
  if (key === "user") return Budgets.user?.[0] || null;
  if (key === "budgets") return Budgets.data;
  if (key === "expenses") return Budgets.expenses;
  return null;
};

export const newUser = ({ userName }) => {
  const newUser = {
    userName,
  };
  Budgets.user = [newUser];

  // Save to local storage for persistence
  localStorage.setItem("user", JSON.stringify(newUser));
};

// Create budget. Pass in name and amount, then save to local storage
export const newBudget = ({ name, amount }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    spent: 0, // Initialize spent amount
    color: generateRandomColor(),
  };
  Budgets.data.push(newItem);

  // Save to local storage for persistence
  const storedBudgets = JSON.parse(localStorage.getItem("budgets")) || [];
  storedBudgets.push(newItem);
  localStorage.setItem("budgets", JSON.stringify(storedBudgets));
};

// Function to create a new expense
export const newExpense = ({ name, amount, budgetsId }, refreshBudgets) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    budgetsId: budgetsId,
  };
  Budgets.expenses.push(newItem);

  // Update the corresponding budget's spent amount
  updateSpentAmount(budgetsId);

  // Save to local storage for persistence
  const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  storedExpenses.push(newItem);
  localStorage.setItem("expenses", JSON.stringify(storedExpenses));

  // Invoke callback to refresh budgets
  if (refreshBudgets) {
    refreshBudgets();
  }
};

// Function to update the spent amount for a specific budget
export const updateSpentAmount = (budgetId) => {
  const existingExpenses = fetchData("expenses") ?? [];
  const budgetExpenses = existingExpenses.filter(
    (expense) => expense.budgetsId === budgetId
  );
  const totalSpent = budgetExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Update the specific budget in Budgets.data
  Budgets.data = Budgets.data.map((budget) =>
    budget.id === budgetId ? { ...budget, spent: totalSpent } : budget
  );

  // Sync with localStorage
  localStorage.setItem("budgets", JSON.stringify(Budgets.data));
};


// Initialize from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
if (storedUser) {
  Budgets.user = [storedUser];
}

const storedBudgets = JSON.parse(localStorage.getItem("budgets"));
if (storedBudgets) Budgets.data = storedBudgets;

const storedExpenses = JSON.parse(localStorage.getItem("expenses"));
if (storedExpenses) Budgets.expenses = storedExpenses;

// Delete item
export const deleteItem = ({ type, id }) => {
  switch (type) {
    case "user":
      Budgets.user = Budgets.user.filter((user) => user.id !== id);
      localStorage.setItem("user", JSON.stringify(Budgets.user));
      break;

    case "budgets":
      Budgets.data = Budgets.data.filter((budget) => budget.id !== id);
      localStorage.setItem("budgets", JSON.stringify(Budgets.data));
      break;

    case "expenses":
      Budgets.expenses = Budgets.expenses.filter(
        (expense) => expense.id !== id
      ); // Filter properly
      localStorage.setItem("expenses", JSON.stringify(Budgets.expenses)); // Persist updated expenses
      break;

    default:
      console.warn("Invalid type:", type);
  }
};
