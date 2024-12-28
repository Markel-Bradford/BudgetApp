const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');


// Add new expense
router.post('/', async (req, res) => {
    const { budgetsId, name, amount} = req.body;
    
    // Ensure that all required fields are present
    if (!budgetsId || !name || !amount) {
        return res.status(400).json({ error: 'Missing required fields (budgetsId, name, amount)' });
    }

    try {
        const expense = await Expense.create({ budgetsId, name, amount });
        console.log('Created expense:', expense);

        // Calculate the total spent for the budget
        const expenses = await Expense.find({budgetsId})
        const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
        console.log('Total spent for budget:', totalSpent);

        // Update corresponding budgets spent amout
        const updatedBudget =
        await Budget.findByIdAndUpdate(budgetsId, {spent: totalSpent}, {new: true});
        
        if (!updatedBudget) {
            throw new Error('Budget not found')
        }

        // Log to onfirm the update budget
        console.log('Updated budget:', updatedBudget);

        // Log expense to verify proper creation
        console.log('Newly created expense:', expense);
        
        // Respond with newly created expense
        res.status(201).json(expense)
    } catch (error) {
        console.error('Error while creating expense:', error.message);
        res.status(500).json({error: error.message});
    }
});

router.get('/:budgetsId', async (req, res) => {
    console.log(`Fetching expenses for budget ID: ${req.params.budgetsId}`);
    
    try {
        const expenses = await Expense.find({ budgetsId: req.params.budgetsId});
        
        if (!expenses.length) {
            console.log(`No expenses found for budget ID: ${req.params.budgetsId}`);
        }
        
        res.json(expenses)
    } catch (error) {
        console.error('Error fetching expenses:', error.message);
        res.status(500).json({error: error.message});
    }
});

module.exports = router;