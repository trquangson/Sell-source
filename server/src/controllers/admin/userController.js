const userService = require('../../services/admin/userService');

// [ADMIN]

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách người dùng' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserRole(
            req.params.id,
            req.body.role,
            req.user.userId
        );
        res.status(200).json({ success: true, message: `Đã đổi quyền thành ${req.body.role}`, data: updatedUser });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id, req.user.userId);
        res.status(200).json({ success: true, message: 'Đã xóa người dùng thành công' });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};

exports.updateUserBalance = async (req, res) => {
    try {
        const { balance } = req.body;
        const updatedUser = await userService.updateUserBalance(req.params.id, Number(balance));
        res.status(200).json({ success: true, message: `Đã cập nhật số dư thành ${balance}đ`, data: updatedUser });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};

