const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/:budgetId', async (req, res) => {
    try {
        const expenses = await Expense.find({ budgetId: req.params.budgetId});
        res.json(expenses)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

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

module.exports = router;