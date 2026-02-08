const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// Add new expense
router.post("/", async (req, res) => {
  const { budgetId, name, amount } = req.body;

  // Ensure that all required fields are present
  if (!budgetId || !name || !amount || amount < 0) {
    return res
      .status(400)
      .json({ error: "Missing required fields (budgetId, name, amount)" });
  }

  const budgetExists = await Budget.findById(budgetId);
  if (!budgetExists) {
    return res.status(404).json({ error: "Budget not found" });
  }

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    const expense = await Expense.create({ budgetId, name, amount });

    // Update corresponding budgets spent amout
    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      {
        $push: { expenses: expense._id }, // Add the new expense ID to the expenses array
        $inc: { spent: amount }, // Increment the spent amount
      },
      { new: true }
    );
    if (!updatedBudget) {
      throw new Error("Budget not found");
    }



    // Respond with newly created expense
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:expenseId", async (req, res) => {
  
  const expenseId = req.params.expenseId;
  
  try {
    // Find the expense by ID
    const expense = await Expense.findById(expenseId)
    if (!expense) {
        return res.status(404).json({error: "Expense not found"})
    }


    // Find the budget by ID
    const budget = await Budget.findById(expense.budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
        expense.budgetId,
        {
          $pull: { expenses: req.params.expenseId }, // Remove the expense ID from the expenses array
          $inc: { spent: -expense.amount }, // Decrement the spent amount
        },
        { new: true }
      );
      if (!updatedBudget) {
        throw new Error("Failed to update budget");
      }  
    //   Delete the expense
    await Expense.findByIdAndDelete(expenseId);


    res.status(200).json({ message: "Expense deleted successfully", updatedBudget });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});

router.get("/:budgetId", async (req, res) => {


  try {
    const expenses = await Expense.find({ budgetId: req.params.budgetId });

    if (!expenses.length) {

    }

    res.json(expenses);
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
