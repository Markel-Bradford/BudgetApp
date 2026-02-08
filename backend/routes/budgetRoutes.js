const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const authenticateUser = require("../middleware/auth");

// Add new budget - requires authentication
router.post("/", authenticateUser, async (req, res) => {
  const { name, amount, color, spent } = req.body;
  const userId = req.user.id; // Get userId from authenticated user's JWT

  if (!name || !amount || !color) {
    return res.status(400).json({ error: "Missing required fields (name, amount, color)" });
  }

  try {
    const budget = await Budget.create({ userId, name, amount, color, spent });
    res.status(201).json(budget);
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});

router.delete("/:budgetId", authenticateUser, async (req, res) => {

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


    res.status(200).json({ message: "Budget deleted successfully", deletedBudget });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});

// Get budgets by userId
router.get("/:userId", authenticateUser, async (req, res) => {
  try {
    // Only allow users to fetch their own budgets
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    const budgets = await Budget.find({ userId: req.params.userId }).populate(
      "expenses"
    );
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:budgetId", authenticateUser, async (req, res) => {
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

    res.status(500).send("Failed to update budget");
  }
});

module.exports = router;
