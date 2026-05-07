const settingService = require('../services/settingService');

exports.getSettings = async (req, res) => {
    try {
        const settings = await settingService.getAllSettings();
        const result = { ...settings };
        if (result['payment.sepayWebhookApiKey']) {
            result['payment.sepayWebhookApiKey.set'] = true;
            delete result['payment.sepayWebhookApiKey'];
        } else {
            result['payment.sepayWebhookApiKey.set'] = false;
        }
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        await settingService.updateSettings(req.body);
        res.json({ success: true, message: 'Cài đặt đã được lưu' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await settingService.getPublicSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
