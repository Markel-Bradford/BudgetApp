const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    color: {type: String, required: true},
});

module.exports = mongoose.model( 'Budget', BudgetSchema)