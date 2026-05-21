const adminForumService = require('../../services/admin/adminForumService');

exports.getAllPostsForAdmin = async (req, res) => {
    try {
        const posts = await adminForumService.getAllPostsForAdmin(req.query);
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePostStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const post = await adminForumService.updatePostStatus(req.params.id, status, rejectionReason);
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
