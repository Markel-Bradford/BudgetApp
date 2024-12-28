const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// Add new expense
router.post("/", async (req, res) => {
  const { budgetId, name, amount } = req.body;

  // Ensure that all required fields are present
  if (!budgetId || !name || !amount || amount < 0) {
    return res.status(400).json({ error: "Missing required fields (budgetId, name, amount)" });
  }

  const budgetExists = await Budget.findById(budgetId);
  if (!budgetExists) {
    return res.status(404).json({ error: "Budget not found" });
  }

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }

    const expense = await Expense.create({ budgetId, name, amount });
    console.log("Created expense:", expense);

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

    // Log to onfirm the update budget
    console.log("Updated budget:", updatedBudget);

    // Log expense to verify proper creation
    console.log("Newly created expense:", expense);

    // Respond with newly created expense
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error while creating expense:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:budgetId", async (req, res) => {
  console.log(`Fetching expenses for budget ID: ${req.params.budgetId}`);

  try {
    const expenses = await Expense.find({ budgetId: req.params.budgetId });

    if (!expenses.length) {
      console.log(`No expenses found for budget ID: ${req.params.budgetId}`);
    }

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
