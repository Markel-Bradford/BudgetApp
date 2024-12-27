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

router.patch(':/expenseId', async (req, res) => {
    const {expenseId} = req.params
    const {name, amount} = req.body
    try {
     const updatedExpense = await Expense.findByIdAndUpdate(
        expenseId,
        {name, amount},
        {new: true} // Return the updated document
    );
    if (!updatedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
    } 
    res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;