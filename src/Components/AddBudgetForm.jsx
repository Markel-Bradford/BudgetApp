import React, { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import { getRandomColor, newBudget } from "../helpers";
import { toast } from "react-toastify";

const AddBudgetForm = ({ userId, refreshBudgets }) => {
  const [budgetName, setbudgetName] = useState("");
  const [amount, setAmount] = useState("");

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();

  const handleBudgetFormSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.getAttribute("data-action");

    if (!budgetName || !amount) {
      toast.error("Budget name and amount are required.");
      return;
    }

    if (action === "createBudget") {
      // Handle create account
      try {
        const color = getRandomColor(); // Generate a random color from helper
        const payload = {
            userId,
            name: budgetName,
            amount: parseFloat(amount),
            color,
          };

          console.log("Budget Payload:", payload); // Debug log
          await newBudget(payload);
      } catch (error) {
        console.error("Error creating budget:", error);
        toast.error("Budget creation failed. Please try again.");
      }
  }
}

  // If form is not submitting, the form will be reset.
  useEffect(
    () => {
      if (!isSubmitting) {
        //clear form
        formRef.current.reset();
        if (refreshBudgets) {
          refreshBudgets(); // Notify parent to refresh budgets and expenses
        }
      }
    }, //reset focus
    [isSubmitting, refreshBudgets]
  );

  return (
    <div className="form-wrapper">
      <h3>Create New Budget</h3>
      <fetcher.Form
        method="post"
        className="grid-sm"
        onSubmit={handleBudgetFormSubmit}
        ref={formRef}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            value={budgetName}
            onChange={(e) => setbudgetName(e.target.value)}
            placeholder="e.g. Utilities"
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. $500"
            inputMode="decimal"
            required
          />
        </div>
        <button
          type="submit"
          className="btn--dark"
          data-action="createBudget"
          disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Submitting Budget...</span>
          ) : (
            <span>Create Budget</span>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddBudgetForm;
