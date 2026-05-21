const adminCouponService = require('../../services/admin/adminCouponService');

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await adminCouponService.getAllCoupons();
        res.json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await adminCouponService.createCoupon(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await adminCouponService.updateCoupon(req.params.id, req.body);
        res.json({ success: true, data: coupon });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        await adminCouponService.deleteCoupon(req.params.id);
        res.json({ success: true, message: 'Đã xóa mã giảm giá' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};
