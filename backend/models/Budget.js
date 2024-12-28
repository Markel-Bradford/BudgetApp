const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    color: {type: String, required: true},
    spent: { type: Number, default: 0 },  // Field to track the spent amount
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }]
});

module.exports = mongoose.model( 'Budget', BudgetSchema)