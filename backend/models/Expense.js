const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    budgetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true,}, 
    name: {type: String, required: true},
    amount: {type: Number, required: true},
});

module.exports = mongoose.model('Expense', ExpenseSchema);