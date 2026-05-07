const couponService = require('../services/couponService');

// ADMIN

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponService.getAllCoupons();
        res.json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await couponService.createCoupon(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await couponService.updateCoupon(req.params.id, req.body);
        res.json({ success: true, data: coupon });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        await couponService.deleteCoupon(req.params.id);
        res.json({ success: true, message: 'Đã xóa mã giảm giá' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

// PUBLIC

exports.validateCoupon = async (req, res) => {
    try {
        const { code, productId, productPrice, productCategory } = req.body;

        if (!code || !productId || !productPrice) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
        }

        // userId lấy từ middleware authenticate 
        const result = await couponService.validateCoupon({
            code,
            productId,
            productPrice,
            productCategory,
            userId: req.user.id,
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};
