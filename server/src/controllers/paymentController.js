const path = require('path');
const fs = require('fs');
const paymentService = require('../services/paymentService');

/**
 * POST /api/purchases
 */
exports.purchase = async (req, res) => {
    try {
        const { sourceId, couponCode } = req.body;
        if (!sourceId) {
            return res.status(400).json({ success: false, message: 'Thiếu sourceId' });
        }

        const result = await paymentService.purchaseSource({
            userId: req.user.userId,
            sourceId,
            couponCode: couponCode || null
        });

        res.status(201).json({
            success: true,
            message: 'Mua thành công',
            data: { transactionId: result.transaction._id }
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/purchases/download/:sourceId
 * Stream file về client và chỉ user đã mua mới được tải.
 */
exports.download = async (req, res) => {
    try {
        const { sourceId } = req.params;
        const purchased = await paymentService.checkPurchased(req.user.userId, sourceId);

        if (!purchased) {
            return res.status(403).json({ success: false, message: 'Bạn chưa mua sản phẩm này' });
        }

        const SourceCode = require('../models/SourceCode');
        const source = await SourceCode.findById(sourceId).select('filePath title');
        if (!source || !source.filePath) {
            return res.status(404).json({ success: false, message: 'File không tồn tại' });
        }

        const absolutePath = path.join(__dirname, '../../storage/sources', source.filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ success: false, message: 'File không tìm thấy trên server' });
        }

        const filename = `${source.title.replace(/[^a-z0-9]/gi, '_')}.zip`;
        res.download(absolutePath, filename);
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/purchases/check/:sourceId
 */
exports.checkPurchased = async (req, res) => {
    try {
        const purchased = await paymentService.checkPurchased(req.user.userId, req.params.sourceId);
        res.json({ success: true, purchased });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/purchases/history?type=DEPOSIT|PURCHASE&page=1
 */
exports.getHistory = async (req, res) => {
    try {
        const { type, page = 1 } = req.query;
        const result = await paymentService.getUserTransactions(
            req.user.userId,
            type || null,
            parseInt(page),
            10
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
