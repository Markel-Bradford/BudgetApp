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

router.delete("/:expenseId", async (req, res) => {
  console.log(`Expense deleted for expense ID: ${req.params.expenseId}`);
  const { budgetId, amount } = req.body;
  
  try {
    // Find the budget by ID
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
        budgetId,
        {
          $pull: { expenses: req.params.expenseId }, // Add the new expense ID to the expenses array
          $inc: { spent: -amount }, // Decrement the spent amount
        },
        { new: true }
      );
      if (!updatedBudget) {
        throw new Error("Budget not found");
      }  

    const deleteExpenses = await Expense.deleteOne({_id: req.params.expenseId});

    if (deleteExpenses.deletedCount === 0) {
        return res.status(404).json({ error: "Expense not found" });
    }

    console.log(`Expense deleted with ID: ${req.params.expenseId}`);
    res.status(200).json({ message: "Expense deleted successfully", updatedBudget });
  } catch (error) {
    console.error("Error deleting expenses:", error.message);
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
