const ForumPost = require('../../models/ForumPost');

exports.getAllPostsForAdmin = async (query) => {
    const { status } = query;
    const filter = {};
    if (status) filter.status = status;

    return ForumPost.find(filter)
        .populate('sellerId', 'username fullName')
        .sort({ createdAt: -1 });
};

exports.updatePostStatus = async (id, status, rejectionReason = '') => {
    const validStatuses = ['approved', 'rejected', 'hidden'];
    if (!validStatuses.includes(status)) {
        throw new Error('Status không hợp lệ');
    }
    const updateData = { status };
    if (status === 'rejected') {
        updateData.rejectionReason = rejectionReason;
    }
    return ForumPost.findByIdAndUpdate(id, updateData, { new: true });
};
