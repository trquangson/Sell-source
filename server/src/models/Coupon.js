const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    // Loại mã: percentage (%) hoặc fixed (số tiền cố định)
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    // Trần giảm tối đa- percentage
    maxDiscount: {
        type: Number,
        default: null
    },

    // Phạm vi áp dụng: all | products | categories
    scope: {
        type: String,
        enum: ['all', 'products', 'categories'],
        default: 'all'
    },
    // Danh sách ObjectId sản phẩm 
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SourceCode'
    }],
    // Danh sách tên danh mục
    applicableCategories: [{
        type: String
    }],

    // Giá trị đơn hàng tối thiểu để áp dụng
    minOrderValue: {
        type: Number,
        default: 0
    },

    // Giới hạn tổng số lần sử dụng (0 = không giới hạn)
    usageLimit: {
        type: Number,
        default: 0
    },
    usedCount: {
        type: Number,
        default: 0
    },

    // Giới hạn per-user: mỗi user chỉ được dùng N lần
    perUserLimit: {
        type: Number,
        default: 1
    },
    // Lưu lịch sử: user nào đã dùng mã này bao nhiêu lần
    usedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        usedCount: {
            type: Number,
            default: 1
        }
    }],

    expiryDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema, 'coupons');
