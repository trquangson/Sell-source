const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['DEPOSIT', 'PURCHASE'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    sepayReference: {
        type: String,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema, "his_transactions");
