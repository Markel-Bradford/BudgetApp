import { useEffect, useState } from "react";


const BudgetItem = ({ budgetId, expenses }) => {
  
  const [totalSpent, setTotalSpent] = useState(0); // State to track total spent
  const { id, name, amount, color } = budgets; // Ensure "spent" reflects the latest state
  
  useEffect(() => {

    // async function to update spent amount
    const fetchAndUpdateSpent = async () => {
      try {
        // Updates the "spent" amount from the backend
        await updateSpentAmount(budgetId);
        
        // Fetch the updated data after updating
        const updatedExpenses = expenses.filter(exp => exp.budgetId === budgetId);
        const newTotalSpent = updatedExpenses.reduce((total, exp) => total + exp.amount, 0);
        setTotalSpent(newTotalSpent)
      } catch (error) {
        console.error("Error updating spent amount:", error)
      }
    };
    
    fetchAndUpdateSpent(); // Call the async function
  }, [expenses, budgetId]); // Dependencies to trigger the effect
  
  const remaining = amount - totalSpent;
  
  return (
    <div className="budget" style={{ "--accent": color }}>
      <div className="progress-text">
        <h2 className="budgetName">{name}</h2>
        <p className="budgAmount">Budget Amount: ${amount}</p>
      </div>
      {/* Update progress dynamically to reflect spent */}
      <progress max={amount} value={totalSpent} ></progress>
      <div className="progress-text">
        <small>${totalSpent.toFixed(2)} spent</small>
        <small>${remaining.toFixed(2)} remaining</small>
      </div>
    </div>
  );
};

export default BudgetItem;