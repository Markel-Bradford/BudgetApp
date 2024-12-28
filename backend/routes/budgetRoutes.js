const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');


// Add new budget
router.post('/', async (req, res) => {
    const {userId, name, amount, color, spent } = req.body;
    try {
        const budget = await Budget.create({userId, name, amount, color, spent});
        res.status(201).json(budget);
    } catch (error) {
        console.error("Error creating budget:", error)
        res.status(500).json({error: error.message});
    }
});

// Get budgets by userId
router.get('/:userId', async (req, res) => {
    try {
        const budgets = await Budget.find({userId: req.params.userId});
        res.json(budgets);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.patch('/:budgetsId', async (req, res) => {
    const { spent } = req.body;
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, { spent }, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(500).send("Failed to update budget");
  }
});

module.exports = router;

