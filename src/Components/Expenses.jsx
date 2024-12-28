import React from "react";
import { deleteItem, fetchData, updateSpentAmount } from "../helpers";
import { TrashIcon } from "@heroicons/react/24/solid";

const Expenses = ({ budgets, refreshData }) => {
  console.log("Budgets passed to Expenses:", budgets); // Add this log to verify the data
  
  const handleDeleteExpense = async (expenseId, budgetId) => {
    try {
      await deleteItem({ type: "expenses", id: expenseId });
      await updateSpentAmount(budgetId);
      refreshData();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="budgetList">
      <h2 className="sectionTitle">Budget Expense List</h2>
      {budgets.map((budget) => (
        <BudgetWithExpenses
          key={budget._id}
          budget={budget}
          refreshData={refreshData}
          onDeleteExpense={handleDeleteExpense}
        />
      ))}
    </div>
  );
};

const BudgetWithExpenses = ({ budget, refreshData, onDeleteExpense }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleExpenses = () => setIsExpanded(!isExpanded);

  console.log("Budget object:", budget); // Log the budget object

  const expenses = Array.isArray(budget.expenses) ? budget.expenses : [];
  console.log(expenses)
  console.log("Expenses in each budget:", budget.expenses);

  return (
    <div className="budgetExpenseList">
      <h3 className="budgetListName" onClick={toggleExpenses}>
        {budget.name} ({budget.spent})
      </h3>
      {isExpanded && (
        <ul className="expenseList">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              budgetId={budget._id}
              onDeleteExpense={onDeleteExpense}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const ExpenseItem = ({ expense, budgetId, onDeleteExpense }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete expense "${expense.name}"?`)) {
      onDeleteExpense(expense.id, budgetId);
    }
  };

  return (
    <li className="expenseDetails">
      <span>{expense.name}</span>
      <span>${expense.amount.toFixed(2)}</span>
      <span>
        <TrashIcon width={20} style={{ color: "red", cursor: "pointer" }} onClick={handleDelete} />
      </span>
    </li>
  );
};

export default Expenses;