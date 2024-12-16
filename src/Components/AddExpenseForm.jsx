import React, { useEffect, useRef } from "react";
import { Form, useFetcher } from "react-router-dom";

const AddExpenseForm = ({budgets, refreshBudgets}) => {
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
    <h3>Add New {""}
        <span>{budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}</span> {/*If budgets.length is equal to 1, it will display the name of the budget receiving an input */}
         {""}Expense
        </h3>
      <fetcher.Form 
      method="post" 
      className="grid-sm"
      ref={formRef}>
    <div className="exp-inputs">
      <div className="grid-xs">
          <label htmlFor="newExpense">Expense </label>
          <input
            type="text"
            name="newExpense"
            id="newExpense"
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
            placeholder="e.g. $58.32"
            inputMode="decimal"
            required
          />
        </div>
        </div>
        <div className="grid-xs" hidden={budgets.length === 1}>
            <label htmlFor="budgetSelect">Budget</label>
            <select name="budgetSelect" id="budgetSelect" required>
                {budgets.sort((a,b) => a.createdAt - b.createdAt).map((budgets) => { return (
                    <option key={budgets.id} value={budgets.id}>{budgets.name}</option>
                    )}
                  )
                }
            </select>
        </div>
        <input type="hidden" name="_action" value="newExpense" />
        <button type="submit" className="btn--dark" disabled={isSubmitting}>
          {isSubmitting ? <span>Submitting Expense...</span> : <span>Create Expense</span> }
        </button>
      </fetcher.Form>
    </div>
  )
}

export default AddExpenseForm
