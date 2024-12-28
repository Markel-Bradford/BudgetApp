const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { findByIdAndUpdate } = require('../models/User');


// Add new expense
router.post('/', async (req, res) => {
    const { budgetsId, name, amount} = req.body;
    try {
        const expense = await Expense.create({ budgetsId, name, amount });

        // Calculate the total spent for the budget
        const expenses = await Expense.find({budgetsId})
        const totalSpent = expenses.reduce((sum, expense) => + expense.amount, 0)

        // Update corresponding budgets spent amout
        await Budget,findByIdAndUpdate(budgetsId, {spent: totalSpent}, {new: true});
        
        // Respond with newly created expense
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

module.exports = router;