

const BudgetItem = ({ budgets, expenses }) => {
  const { id, name, amount, color, spent } = budgets; // Ensure "spent" reflects the latest state
  
  // Filter expenses related to this budget
  const budgetExpenses = expenses.filter(
    (expense) => expense.budgetsId === budgets.id
  );

  // Calculate the total spent for this budget
  const totalSpent = budgetExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  
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