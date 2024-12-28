import React from "react";
import {
  deleteExpenseAndUpdateBudget
} from "../helpers";
import { TrashIcon } from "@heroicons/react/24/solid";

const Expenses = ({ budgets, refreshBudgets }) => {
  console.log("Budgets passed to Expenses:", budgets); // Add this log to verify the data

  const handleDeleteExpense = async (expenseId, budgetId, amount) => {
    try {
      // Delete the expense and update the budget amount
      await deleteExpenseAndUpdateBudget(expenseId, budgetId, amount);
   
      // Refresh the budgets and expenses data
      refreshBudgets();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="budgetList">
      <h2 className="sectionTitle listOfBudgets">Budget Expense List</h2>
      {budgets.map((budget) => (
        <BudgetWithExpenses
          key={budget._id}
          budget={budget}
          onDeleteExpense={handleDeleteExpense}
        />
      ))}
    </div>
  );
};

const BudgetWithExpenses = ({ budget, onDeleteExpense, refreshBudgets  }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleExpenses = () => setIsExpanded(!isExpanded);

  console.log("Budget object:", budget); // Log the budget object

  const expenses = Array.isArray(budget.expenses) ? budget.expenses : [];
  console.log(expenses);
  console.log("Expenses in each budget:", budget.expenses);

  return (
    <div className="budgetExpenseList">
      <h3 className="budgetListName" onClick={toggleExpenses}>
        {budget.name} (${budget.spent.toFixed(2)})
      </h3>
      {isExpanded && (
        <ul className="expenseList">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              budgetId={budget._id}
              onDeleteExpense={onDeleteExpense}
              refreshBudgets={refreshBudgets} // Pass refresh function here as well
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
      onDeleteExpense(expense._id, budgetId, expense.amount);
    }
  };

  return (
    <div className="expenseDetailsContainer">
    <li className="expenseDetails">
      <span>Expense: {expense.name}</span>
      <span>${expense.amount.toFixed(2)}</span>
      
      <span>
        <TrashIcon
          width={20}
          style={{ color: "red", cursor: "pointer" }}
          onClick={handleDelete}
        />
      </span>
    </li>
    </div>
  );
};

export default Expenses;
