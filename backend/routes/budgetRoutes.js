const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Add new budget
router.post("/", async (req, res) => {
  const { userId, name, amount, color, spent } = req.body;

  if (!userId || !name || !amount || !color) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const budget = await Budget.create({ userId, name, amount, color, spent });
    res.status(201).json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:budgetId", async (req, res) => {
  console.log(`Budget deleted for budget ID: ${req.params.budgetId}`);
  const { budgetId } = req.params;

  try {
    // Find the budget bu ID
    const budget = await Budget.findById(budgetId);
    if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
    }

    // Delete assocaited expenses
    await Expense.deleteMany({ budgetId: budgetId});

    // Delete the budget
    const deletedBudget = await Budget.findByIdAndDelete(budgetId)
    if (!deletedBudget) {
        throw new Error("Failed to delete budget")
    }

    console.log(`Budget deleted with ID: ${budgetId}`);
    res.status(200).json({ message: "Budget deleted successfully", deletedBudget });
  } catch (error) {
    console.error("Error deleting budget:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get budgets by userId
router.get("/:userId", async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.params.userId }).populate(
      "expenses"
    );
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:budgetId", async (req, res) => {
  const { spent } = req.body;
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.budgetId,
      { spent },
      { new: true }
    );
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json(budget);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).send("Failed to update budget");
  }
});

module.exports = router;
