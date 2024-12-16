import React, { useState, useEffect } from "react";
import { Budgets } from "../Data/Budgets";
import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteItem, fetchData, updateSpentAmount } from "../helpers";

const Expenses = ({budgets, refreshBudgets}) => {
  const [budget, setBudget] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchedBudgets = fetchData("budgets") || [];
    const fetchedExpenses = fetchData("expenses") || [];
    setBudget(fetchedBudgets);
    setExpenses(fetchedExpenses);
  }, []);

  // Handle deletion of an expense
  const handleDeleteExpense = (expenseId, budgetId) => {
    // Delete the expense from wherever it is stored
    deleteItem({ type: "expenses", id: expenseId });

    // Recalculate and update the spent amount for the budget
    updateSpentAmount(budgetId);

    // Fetch updated data and set state
    const updatedBudgets = fetchData("budgets") || [];
    const updatedExpenses = fetchData("expenses") || [];
    setBudget(updatedBudgets); // This triggers re-render for all components
    setExpenses(updatedExpenses); // This triggers re-render of BudgetItem

    // Refresh budgets and expenses in parent Dashboard
    refreshBudgets();
  };

  return (
    <div className="budgetList">
      <h2 className="sectionTitle">Budget Expense List</h2>
      {budget.map((budget) => (
        <BudgetWithExpenses
          key={budget.id}
          budget={budget}
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense} // Pass delete handler
        />
      ))}
    </div>
  );
};

const BudgetWithExpenses = ({ budget, expenses, onDeleteExpense }) => {
  const budgetExpenses = expenses.filter(
    (expense) => expense.budgetsId === budget.id
  );

  const totalSpent = budgetExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  return (
    <div className="budgetExpenseList">
      <h3 className="budgetListName" onClick={handleClick}>
        <span>{budget.name}</span>{" "}
        <span>(Spent: ${totalSpent.toFixed(2)})&#9661;</span>
      </h3>
      <ul
        className={click ? "expenseList" : "expenseListHidden"}
        >
        {budgetExpenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            budgetId={budget.id}
            onDeleteExpense={onDeleteExpense}
          />
        ))}
      </ul>
    </div>
  );
};

const ExpenseItem = ({ expense, onDeleteExpense }) => {
  const handleDelete = () => {
    // Pass the expense id, amount, and budgetID to the callback
    onDeleteExpense(expense.id, expense.budgetsId); // Call the callback passed from the parent
  };

  return (
    <>
      <div className="expenseDetailsContainer">
        <h5 className="expenseDetails">
          <span>Expense: {expense.name}</span>
          <span>Amount: ${expense.amount.toFixed(2)}</span>
          <span>Date: {new Date(expense.createdAt).toLocaleDateString()}</span>
          <span onClick={handleDelete}>
            <TrashIcon width={20} style={{ color: "red", cursor: "pointer" }} />{" "}
          </span>
        </h5>
      </div>
    </>
  );
};

export default Expenses;
