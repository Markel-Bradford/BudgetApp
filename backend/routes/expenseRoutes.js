const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');


// Add new expense
router.post('/', async (req, res) => {
    const { budgetsId, name, amount} = req.body;
    try {
        const expense = await Expense.create({ budgetsId, name, amount });
        res.status(201).json(expense)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:budgetsId', async (req, res) => {
    console.log(`Fetching expenses for budget ID: ${req.params.budgetsId}`);
    try {
        const expenses = await Expense.find({ budgetsId: req.params.budgetsId});
        res.json(expenses)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.patch(':/budgetsId', async (req, res) => {
    const { spent } = req.body;
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, { spent }, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(500).send("Failed to update budget");
  }
});

module.exports = router;