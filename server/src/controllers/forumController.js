const forumService = require('../services/forumService');
const path = require('path');
const fs = require('fs');

exports.createPost = async (req, res) => {
    try {
        const post = await forumService.createPost(req.user.userId, req.body, req.files);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await forumService.updatePost(req.user.userId, req.params.id, req.body, req.files);
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await forumService.deletePost(req.user.userId, req.params.id);
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.getPublicPosts = async (req, res) => {
    try {
        const result = await forumService.getPublicPosts(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const review = await forumService.addReview(req.params.id, req.user.userId, req.body);
        res.status(201).json({ message: 'Thêm đánh giá thành công', data: review });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const result = await forumService.getReviews(req.params.id, req.query);
        res.json({ data: result });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

exports.incrementView = async (req, res) => {
    try {
        await forumService.incrementView(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await forumService.getPostById(req.params.id, req.user);
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const posts = await forumService.getMyPosts(req.user.userId);
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.checkPurchased = async (req, res) => {
    try {
        const purchased = await forumService.checkPurchased(req.user.userId, req.params.id);
        res.json({ success: true, purchased });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.purchasePost = async (req, res) => {
    try {
        await forumService.purchasePost(req.user.userId, req.params.id);
        res.status(201).json({ success: true, message: 'Mua thành công' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.downloadPost = async (req, res) => {
    try {
        const { id } = req.params;
        const purchased = await forumService.checkPurchased(req.user.userId, id);
        if (!purchased) {
            return res.status(403).json({ success: false, message: 'Bạn chưa mua sản phẩm này' });
        }

        const ForumPost = require('../models/ForumPost');
        const post = await ForumPost.findById(id).select('filePath title');
        if (!post || !post.filePath) {
            return res.status(404).json({ success: false, message: 'File không tồn tại' });
        }

        const absolutePath = path.join(__dirname, '../../storage/forum-sources', post.filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ success: false, message: 'File không tìm thấy trên server' });
        }

        const ext = path.extname(post.filePath);
        const safeTitle = post.title.replace(/[^a-z0-9]/gi, '_');
        const filename = ext ? `${safeTitle}${ext}` : safeTitle;
        res.download(absolutePath, filename);
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

// Admin
exports.getAllPostsForAdmin = async (req, res) => {
    try {
        const posts = await forumService.getAllPostsForAdmin(req.query);
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePostStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const post = await forumService.updatePostStatus(req.params.id, status, rejectionReason);
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
