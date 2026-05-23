const ForumPost = require('../../models/ForumPost');
const notificationService = require('../client/clientNotificationService');


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
    
    const post = await ForumPost.findById(id);
    if (!post) throw new Error('Không tìm thấy bài viết');
    
    const oldStatus = post.status;
    
    post.status = status;
    if (status === 'rejected') {
        post.rejectionReason = rejectionReason;
    }
    await post.save();

    if (oldStatus !== status) {
        if (status === 'approved') {
            await notificationService.createNotification({
                userId: post.sellerId,
                type: 'ADMIN',
                title: 'Bài đăng được duyệt',
                message: `Mã nguồn "${post.title}" của bạn đã được duyệt và đang hiển thị trên diễn đàn.`,
                metadata: { postId: post._id.toString() }
            });
        } else if (status === 'rejected') {
            await notificationService.createNotification({
                userId: post.sellerId,
                type: 'ADMIN',
                title: 'Bài đăng bị từ chối',
                message: `Mã nguồn "${post.title}" của bạn đã bị từ chối. Lý do: ${rejectionReason}`,
                metadata: { postId: post._id.toString() }
            });
        }
    }

    return post;
};
