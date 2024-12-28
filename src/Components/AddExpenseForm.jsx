import React, { useEffect, useRef, useState } from "react";
import { Form, useFetcher } from "react-router-dom";
import { newExpense } from "../helpers";

const AddExpenseForm = ({ budgets, refreshBudgets }) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState(
    budgets.length === 1 ? budgets[0]._id : ""
  );

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();

  const handleExpenseFormSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.getAttribute("data-action");

    if (!expenseName || !expenseAmount) {
      toast.error("Budget name and amount are required.");
      return;
    }

    if (action === "createExpense") {
      // Handle create account
      try {
        const payload = {
          budgetsId: selectedBudgetId,
          name: expenseName,
          amount: parseFloat(expenseAmount),
        };

        console.log("Expense Payload:", payload); // Debug log
        await newExpense(payload);
        toast.success("Expense added successfully!");
        setExpenseName("");
        setExpenseAmount("");
        setSelectedBudgetId(budgets.length === 1 ? budgets[0]._id : ""); // Reset budget selection if multiple
        refreshBudgets()
      } catch (error) {
        console.error("Error creating expense:", error);
        toast.error("Expense creation failed. Please try again.");
      }
    }
  };

  const handleBudgetChange = (e) => {
    setSelectedBudgetId(e.target.value);
  };

  // If form is not submitting, the form will be reset.
  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset();
      focusRef.current?.focus();
    }
  }, [isSubmitting]); // Refresh parent only if necessary

  return (
    <div className="form-wrapper">
      <h3>
        Add New {""}
        <span>
          {budgets.length === 1 && <span>{budgets[0].name} </span>}
        </span>{" "}
        {/*If budgets.length is equal to 1, it will display the name of the budget receiving an input */}
        {""}Expense
      </h3>
      <fetcher.Form
        method="post"
        className="grid-sm"
        ref={formRef}
        onSubmit={handleExpenseFormSubmit}>
        <div className="exp-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense </label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="e.g. Water Bill"
              ref={focusRef}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              name="newExpenseAmount"
              id="newExpenseAmount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="e.g. $58.32"
              inputMode="decimal"
              required
            />
          </div>
        </div>
        <div className="grid-xs" hidden={budgets.length === 1}>
          <label htmlFor="budgetSelect">Budget</label>
          <select
            name="budgetSelect"
            id="budgetSelect"
            value={selectedBudgetId}
            onChange={handleBudgetChange}
            required>
            {budgets.map((budget) => {
              return (
                <option key={budget._id} value={budget._id}>
                  {budget.name}
                </option>
              );
            })}
          </select>
        </div>
        <button
          type="submit"
          className="btn--dark"
          data-action="createExpense"
          disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Submitting Expense...</span>
          ) : (
            <span>Create Expense</span>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddExpenseForm;
