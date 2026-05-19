const mongoose = require('mongoose');

const forumReviewSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    }
}, { timestamps: true });

// Mỗi user chỉ được đánh giá 1 lần cho 1 bài viết
forumReviewSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ForumReview', forumReviewSchema, 'forum_reviews');
