const mongoose = require('mongoose');

const forumPurchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

forumPurchaseSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('ForumPurchase', forumPurchaseSchema, "forum_purchases");
