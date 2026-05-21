const Coupon = require('../../models/Coupon');

/**
 * Kiểm tra và tính toán giảm giá.
 * Trả về object chứa discountAmount và finalPrice.
 * Ném lỗi chi tiết nếu mã không hợp lệ (hết hạn, sai phạm vi, vượt giới hạn...).
 *
 * @param {object} params
 * @param {string} params.code
 * @param {string} params.productId
 * @param {number} params.productPrice
 * @param {string} params.productCategory
 * @param {string} params.userId - Lấy từ req.user.id (server-side, không tin client)
 */
const validateCoupon = async ({ code, productId, productPrice, productCategory, userId }) => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isActive) {
        const error = new Error('Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa');
        error.statusCode = 400;
        throw error;
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        const error = new Error('Mã giảm giá đã hết hạn');
        error.statusCode = 400;
        throw error;
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        const error = new Error('Mã giảm giá đã được sử dụng hết lượt');
        error.statusCode = 400;
        throw error;
    }

    // Kiểm tra giới hạn per-user bằng userId từ server 
    const userUsage = coupon.usedBy.find(u => u.user.toString() === userId.toString());
    if (userUsage && userUsage.usedCount >= coupon.perUserLimit) {
        const error = new Error(`Bạn đã dùng mã này ${coupon.perUserLimit} lần (tối đa cho phép)`);
        error.statusCode = 400;
        throw error;
    }

    if (coupon.scope === 'products') {
        const ids = coupon.applicableProducts.map(id => id.toString());
        if (!ids.includes(productId.toString())) {
            const error = new Error('Mã giảm giá không áp dụng cho sản phẩm này');
            error.statusCode = 400;
            throw error;
        }
    }

    if (coupon.scope === 'categories') {
        if (!coupon.applicableCategories.includes(productCategory)) {
            const error = new Error('Mã giảm giá không áp dụng cho danh mục này');
            error.statusCode = 400;
            throw error;
        }
    }

    if (productPrice < coupon.minOrderValue) {
        const error = new Error(`Sản phẩm cần tối thiểu ${coupon.minOrderValue.toLocaleString()}đ để áp dụng mã này`);
        error.statusCode = 400;
        throw error;
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (productPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else {
        discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, productPrice);
    const finalPrice = Math.max(0, productPrice - discountAmount);

    return {
        couponId: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount),
        originalPrice: productPrice,
        finalPrice: Math.round(finalPrice),
    };
};

module.exports = { validateCoupon };
