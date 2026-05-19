const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        maxlength: 300,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        default: 'Khác'
    },
    tags: [{
        type: String
    }],
    thumbnail: {
        type: String,
        default: ''
    },
    demoImages: [{
        type: String
    }],
    filePath: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'hidden'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    purchaseCount: {
        type: Number,
        default: 0,
        min: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

forumPostSchema.index({ status: 1, createdAt: -1 });
forumPostSchema.index({ sellerId: 1, createdAt: -1 });

module.exports = mongoose.model('ForumPost', forumPostSchema, "forum_posts");
