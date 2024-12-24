import React, { useEffect, useRef } from "react";
import { useFetcher } from "react-router-dom";

const AddBudgetForm = ({ refreshBudgets }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();


  // If form is not submitting, the form will be reset.
  useEffect(() => {
    if(!isSubmitting) {
      //clear form
      formRef.current.reset()
      if (refreshBudgets) {
        refreshBudgets() // Notify parent to refresh budgets and expenses
      }
    }
  }, //reset focus 
  [isSubmitting, refreshBudgets]);

  return (
    <div className="form-wrapper">
      <h3>Create New Budget</h3>
      <fetcher.Form 
      method="post" 
      className="grid-sm"
      ref={formRef}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
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
            placeholder="e.g. $500"
            inputMode="decimal"
            required
          />
        </div>
        <input type="hidden" name="_action" value="newBudget" />
        <button type="submit" className="btn--dark" disabled={isSubmitting}>
          {isSubmitting ? <span>Submitting Budget...</span> : <span>Create Budget</span> }
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddBudgetForm;
