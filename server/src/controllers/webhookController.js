const webhookService = require('../services/webhookService');
const settingService = require('../services/client/clientSettingService');

/**
 * POST /api/webhook/sepay
 * Nhận sự kiện từ SePay: xác thực API key, luôn trả 200.
 */
exports.sePayWebhook = async (req, res) => {
    const apiKey = req.headers['authorization'];

    // Đọc key từ DB trước, fallback sang env
    const storedKey = await settingService.getSetting('payment.sepayWebhookApiKey');
    const expectedKey = storedKey || process.env.SEPAY_WEBHOOK_APIKEY;

    if (!expectedKey || apiKey !== `Apikey ${expectedKey}`) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const result = await webhookService.handleSePayWebhook(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('[SePay Webhook Error]', error.message);
        // Trả 200 để SePay không retry - lỗi đã được log
        return res.status(200).json({ success: false, message: error.message });
    }
};
