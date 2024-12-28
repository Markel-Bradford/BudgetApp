const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');


// Add new budget
router.post('/', async (req, res) => {
    const {userId, name, amount, color, spent } = req.body;
    
    if (!userId || !name || !amount || !color) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
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
        const budgets = await Budget.find({userId: req.params.userId}).populate('expenses');
        res.json(budgets);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.patch('/:budgetId', async (req, res) => {
    const { spent } = req.body;
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.budgetId, { spent }, { new: true });
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).send("Failed to update budget");
  }
});

module.exports = router;

