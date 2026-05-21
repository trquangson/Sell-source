const clientCouponService = require('../../services/client/clientCouponService');

exports.validateCoupon = async (req, res) => {
    try {
        const { code, productId, productPrice, productCategory } = req.body;

        if (!code || !productId || !productPrice) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
        }

        // userId lấy từ middleware authenticate 
        const result = await clientCouponService.validateCoupon({
            code,
            productId,
            productPrice,
            productCategory,
            userId: req.user.userId,
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};
