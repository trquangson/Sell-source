const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SourceCode = require('../models/SourceCode');
const couponService = require('./couponService');
const Coupon = require('../models/Coupon');



/**
 * Xử lý mua sản phẩm.
 * Trừ balance, ghi lịch sử, tăng purchaseCount, chống race condition.
 *
 * @returns {{ filePath: string, transaction: object }}
 */
const purchaseSource = async ({ userId, sourceId, couponCode }) => {
    const source = await SourceCode.findById(sourceId);
    if (!source || source.status !== 'active') {
        const err = new Error('Sản phẩm không tồn tại hoặc đã ngừng bán');
        err.statusCode = 404;
        throw err;
    }

    // Kiểm tra đã mua chưa
    const user = await User.findById(userId);
    if (!user) {
        const err = new Error('Người dùng không tồn tại');
        err.statusCode = 404;
        throw err;
    }

    const alreadyPurchased = user.purchased_sources.some(
        id => id.toString() === sourceId.toString()
    );
    if (alreadyPurchased) {
        const err = new Error('Bạn đã mua sản phẩm này');
        err.statusCode = 409;
        throw err;
    }

    // Tính giá cuối (lấy từ server)
    let finalPrice = source.price;
    let discountAmount = 0;
    let validatedCoupon = null;

    if (couponCode) {
        validatedCoupon = await couponService.validateCoupon({
            code: couponCode,
            productId: sourceId,
            productPrice: source.price,
            productCategory: source.category,
            userId
        });
        discountAmount = validatedCoupon.discountAmount;
        finalPrice = validatedCoupon.finalPrice;
    }

    // trừ balance khi đủ tiền
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId, balance: { $gte: finalPrice } },
        {
            $inc: { balance: -finalPrice },
            $push: { purchased_sources: sourceId }
        },
        { returnDocument: 'after' }
    );

    if (!updatedUser) {
        const err = new Error('Số dư không đủ để thực hiện giao dịch');
        err.statusCode = 402;
        throw err;
    }

    // Cập nhật usedBy trong Coupon nếu có áp mã
    if (couponCode && validatedCoupon) {
        await Coupon.findOneAndUpdate(
            { code: couponCode.toUpperCase() },
            {
                $inc: { usedCount: 1 },
                $push: {
                    usedBy: {
                        user: userId,
                        usedCount: 1,
                        usedAt: new Date()
                    }
                }
            }
        );
    }

    // Tạo transaction + tăng purchaseCount
    const [transaction] = await Promise.all([
        Transaction.create({
            userId,
            type: 'PURCHASE',
            amount: finalPrice,
            status: 'completed',
            sourceId,
            originalAmount: source.price,
            discountAmount,
            couponCode: couponCode ? couponCode.toUpperCase() : '',
            description: `Mua sản phẩm: ${source.title}`
        }),
        SourceCode.findByIdAndUpdate(sourceId, { $inc: { purchaseCount: 1 } })
    ]);

    return {
        filePath: source.filePath,
        transaction
    };
};

const checkPurchased = async (userId, sourceId) => {
    const user = await User.findById(userId).select('purchased_sources');
    if (!user) return false;
    return user.purchased_sources.some(id => id.toString() === sourceId.toString());
};

const getUserTransactions = async (userId, type = null, page = 1, limit = 10) => {
    const query = { userId, status: 'completed' };
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
        Transaction.find(query)
            .populate('sourceId', 'title thumbnail price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Transaction.countDocuments(query)
    ]);

    return { transactions, total, page, totalPages: Math.ceil(total / limit) };
};

module.exports = { purchaseSource, checkPurchased, getUserTransactions };

