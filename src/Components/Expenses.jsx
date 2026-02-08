import React, { useState } from "react";
import { deleteExpenseAndUpdateBudget } from "../helpers";
import { TrashIcon } from "@heroicons/react/24/solid";

const Expenses = ({ budgets, refreshBudgets }) => {
  

  const handleDeleteExpense = async (expenseId, budgetId) => {
    try {
      // Delete the expense and update the budget amount
      const updatedBudget = await deleteExpenseAndUpdateBudget(
        expenseId,
        budgetId
      );

      // Refresh the budgets and expenses data
      refreshBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget._id === updatedBudget._id ? updatedBudget : budget
        )
      );
    } catch (error) {
      
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

const BudgetWithExpenses = ({ budget, onDeleteExpense, refreshBudgets }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleExpenses = () => setIsExpanded(!isExpanded);

  

  const expenses = Array.isArray(budget.expenses) ? budget.expenses : [];
 

  return (
    <div className="budgetExpenseList">
      <h3 className="budgetListName" onClick={toggleExpenses}>
        <span>
          {budget.name} (${budget.spent.toFixed(2)})
        </span>
        <span>{isExpanded ? <>&#9650;</> : <>&#9660;</>}</span>
      </h3>
      {isExpanded && (
        <ul className="expenseList">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              budgetId={budget._id}
              onDeleteExpense={onDeleteExpense}
              refreshBudgets={refreshBudgets} // Pass refresh function here
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const ExpenseItem = ({ expense, budgetId, onDeleteExpense }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    if (window.confirm(`Delete expense "${expense.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDeleteExpense(expense._id, budgetId, expense.amount);
      } catch (error) {
        
      } finally {
        setIsDeleting(false);
      }
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
            style={{
              color: "red",
              cursor: isDeleting ? "not-allowed" : "pointer",
            }}
            onClick={isDeleting ? null : handleDelete}
          />
        </span>
      </li>
    </div>
  );
};

export default Expenses;
