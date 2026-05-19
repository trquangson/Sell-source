const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['DEPOSIT', 'PURCHASE', 'FORUM_PURCHASE', 'SELLER_EARNING'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['completed', 'failed'],
        default: 'completed'
    },

    // --- DEPOSIT fields ---
    gateway: {
        type: String,
        default: ''
    },
    sepayReference: {
        type: String,
        unique: true,
        sparse: true
    },

    // --- PURCHASE fields ---
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SourceCode',
        default: null
    },
    forumPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        default: null
    },
    originalAmount: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

transactionSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema, 'his_transactions');
