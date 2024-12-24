import React, { useState, useEffect } from "react";
import { Budgets } from "../Data/Budgets";
import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteItem, fetchData as fetchDataHelper, updateSpentAmount } from "../helpers";

const Expenses = ({budgets, refreshBudgets}) => {
  const [budgetList, setBudgetList] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const budgetResponse = await fetch('/api/budgets');
        const expenseResponse = await fetch('api/expenses');
        const budgets = await budgetResponse.json();
        const expenses = await expenseResponse.json()
        setBudgetList(budgets);
        setExpenses(expenses)
    } catch (error) {
      console.error(error) 
    } finally {
      setLoading(false);
    }
  }
   fetchAllData();
  }, []);


  // Handle deletion of an expense
  const handleDeleteExpense = async (expenseId, budgetId) => {
    try
      {// Delete the expense from wherever it is stored
        await deleteItem({ type: "expenses", id: expenseId });

        // Recalculate and update the spent amount for the budget
        await updateSpentAmount(budgetId);

        // Fetch updated data and set state
        const updatedBudgets = await fetchHelperData("budgets") || [];
        const updatedExpenses = await fetchHelperData("expenses") || [];
        setBudget(updatedBudgets || []); // This triggers re-render for all components
        setExpenses(updatedExpenses || []); // This triggers re-render of BudgetItem

        // Refresh budgets and expenses in parent Dashboard
        refreshBudgets();
      } catch (error) {
        console.error("Error deleting expenses:", error);
      }
  };

  if (loading) {
    return <p>Loading budgets and expenses...</p>
  }

  return (
    <div className="budgetList">
      <h2 className="sectionTitle">Budget Expense List</h2>
      {budgetList.map((budget) => (
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

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpenseVisibility = () => setIsExpanded(!isExpanded);

  return (
    <div className="budgetExpenseList">
      <h3 className="budgetListName" onClick={toggleExpenseVisibility}>
        <span>{budget.name}</span>{" "}
        <span>(Spent: ${totalSpent.toFixed(2)})&#9661;</span>
      </h3>
      { isExpanded && (
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
      )}
    </div>
  );
};

const ExpenseItem = ({ expense, onDeleteExpense }) => {
  const handleDelete = () => {
    // Confirm item deletion and handle delete
    if (window.confirm(`Delete expense "${expense.name}"?`)) {
      onDeleteExpense(expense.id, expense.budgetId)
    }
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
