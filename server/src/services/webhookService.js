const User = require('../models/User');
const Transaction = require('../models/Transaction');
const notificationService = require('./client/clientNotificationService');

const TRANSFER_PREFIX = process.env.TRANSFER_PREFIX || 'SS';

/**
 * Xử lý webhook từ SePay khi có giao dịch chuyển khoản đến.
 * Tự động cộng balance cho user dựa trên nội dung CK.
 * Luôn resolve (không throw) để SePay không retry vô hạn.
 */
const handleSePayWebhook = async (payload) => {
    const { transferType, transferAmount, content, referenceCode, gateway, accountNumber } = payload;

    if (transferType !== 'in' || !transferAmount || transferAmount <= 0) {
        return { success: true, message: 'Ignored: not an incoming transfer' };
    }

    // Chống duplicate - 1 referenceCode chỉ xử lý 1 lần
    const existing = await Transaction.findOne({ sepayReference: referenceCode });
    if (existing) {
        return { success: true, message: 'Already processed' };
    }

    // Parse username từ content
    const regex = new RegExp(`${TRANSFER_PREFIX}\\s+(\\w+)`, 'i');
    const match = (content || '').match(regex);

    if (!match) {
        await Transaction.create({
            userId: new (require('mongoose').Types.ObjectId)(),
            type: 'DEPOSIT',
            amount: transferAmount,
            status: 'failed',
            gateway: gateway || 'SEPAY',
            sepayReference: referenceCode,
            description: `Không xác định được user. Nội dung: ${content}`
        });
        return { success: true, message: 'User not identified, logged as failed' };
    }

    const username = match[1].toLowerCase();
    const user = await User.findOne({ username });

    if (!user) {
        return { success: true, message: `User "${username}" not found` };
    }

    await Promise.all([
        User.findByIdAndUpdate(user._id, { $inc: { balance: transferAmount } }),
        Transaction.create({
            userId: user._id,
            type: 'DEPOSIT',
            amount: transferAmount,
            status: 'completed',
            gateway: gateway || 'SEPAY',
            sepayReference: referenceCode,
            description: `Nạp tiền qua ${gateway || 'SePay'} - TK: ${accountNumber || ''}`
        }),
        notificationService.createNotification({
            userId: user._id,
            type: 'DEPOSIT',
            title: 'Nạp tiền thành công',
            message: `Tài khoản của bạn đã được cộng ${transferAmount.toLocaleString('vi-VN')}₫`,
            metadata: { amount: transferAmount, gateway: gateway || 'SEPAY' }
        })
    ]);

    return { success: true, message: `Deposited ${transferAmount} for ${username}` };
};

module.exports = { handleSePayWebhook };
