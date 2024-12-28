const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');


// Add new budget
router.post('/', async (req, res) => {
    const {userId, name, amount, color } = req.body;
    try {
        const budget = await Budget.create({userId, name, amount, color});
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

module.exports = router;

