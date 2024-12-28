import React, { useEffect, useState } from "react";

const BudgetItem = ({ budget, expenses }) => {
  const { _id, name, amount, color } = budget;
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const calculateSpent = async () => {
      try {
        // Filter expenses for current budget
        const budgetExpenses = expenses.filter((expense) => expense.budgetId === _id);
        // Calculate total spent for this budget
        const updatedSpent = budgetExpenses.reduce((total, expense) => total + expense.amount, 0);
        
        // Update local state
        setTotalSpent(updatedSpent);
      } catch (error) {
        console.error("Error updating spent amount:", error);
      }
    };

    calculateSpent();
  }, [expenses, _id]);

  const remaining = amount - totalSpent;

  return (
    <div className="budget" style={{ "--accent": color }}>
      <div className="progress-text">
        <h2 className="budgetName">{name}</h2>
        <p className="budgAmount">Budget Amount: ${amount}</p>
      </div>
      <progress max={amount} value={totalSpent}></progress>
      <div className="progress-text">
        <small>${totalSpent.toFixed(2)} spent</small>
        <small>${remaining.toFixed(2)} remaining</small>
      </div>
    </div>
  );
};

export default BudgetItem;
