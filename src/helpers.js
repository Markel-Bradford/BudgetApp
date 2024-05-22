export const wait = () => new Promise(res => setTimeout(res, Math.random() * 800))

//Random color generator
const generateRandomColor = () => {
  const existingBudgetsLength = fetchData("budgets")?.length ?? 0; //Length will be 0 or length of array of budgets
  return `${existingBudgetsLength * 34} 65% 50%`
}

// Local storage
export const fetchData = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };

// Create budget. Pass in name and amount, then save to local storage
export const newBudget = ({name, amount}) => {
    const newItem = {
      id: crypto.randomUUID(),
      name: name,
      createdAt: Date.now(),
      amount: +amount,
      color: generateRandomColor()
    }
    const existingBudgets = fetchData("budgets") ?? []
    return localStorage.setItem("budgets", JSON.stringify([...existingBudgets, newItem]))
}

// Create new expense. Pull budget ID to determine where expense is placed
export const newExpense = ({name, amount, budgetsId}) => {
  const newItems = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    budgetsId: budgetsId
  }
  const existingExpenses = fetchData("expenses") ?? []
  return localStorage.setItem("expenses", JSON.stringify([...existingExpenses, newItems]))
}

// Delete item
export const deleteItem = ({key}) => {
  return localStorage.removeItem(key)
}