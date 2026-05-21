const Coupon = require('../../models/Coupon');

const getAllCoupons = async () => {
    return Coupon.find().sort({ createdAt: -1 });
};

const createCoupon = async (data) => {
    const {
        code, discountType, discountValue, maxDiscount,
        scope, applicableProducts, applicableCategories,
        minOrderValue, usageLimit, perUserLimit, expiryDate
    } = data;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
        const error = new Error('Mã giảm giá đã tồn tại');
        error.statusCode = 400;
        throw error;
    }

    return Coupon.create({
        code,
        discountType,
        discountValue: Number(discountValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        scope: scope || 'all',
        applicableProducts: scope === 'products' ? (applicableProducts || []) : [],
        applicableCategories: scope === 'categories' ? (applicableCategories || []) : [],
        minOrderValue: Number(minOrderValue) || 0,
        usageLimit: Number(usageLimit) || 0,
        perUserLimit: Number(perUserLimit) || 1,
        expiryDate: expiryDate || null,
    });
};

const updateCoupon = async (id, data) => {
    const {
        discountType, discountValue, maxDiscount,
        scope, applicableProducts, applicableCategories,
        minOrderValue, usageLimit, perUserLimit, expiryDate, isActive
    } = data;

    const updatePayload = {
        discountType,
        discountValue: Number(discountValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        scope: scope || 'all',
        applicableProducts: scope === 'products' ? (applicableProducts || []) : [],
        applicableCategories: scope === 'categories' ? (applicableCategories || []) : [],
        minOrderValue: Number(minOrderValue) || 0,
        usageLimit: Number(usageLimit) || 0,
        perUserLimit: Number(perUserLimit) || 1,
        expiryDate: expiryDate || null,
        isActive: Boolean(isActive),
    };

    const coupon = await Coupon.findByIdAndUpdate(id, updatePayload, { returnDocument: 'after' });
    if (!coupon) {
        const error = new Error('Không tìm thấy mã giảm giá');
        error.statusCode = 404;
        throw error;
    }

    return coupon;
};

const deleteCoupon = async (id) => {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        const error = new Error('Không tìm thấy mã giảm giá');
        error.statusCode = 404;
        throw error;
    }
};

module.exports = { getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
