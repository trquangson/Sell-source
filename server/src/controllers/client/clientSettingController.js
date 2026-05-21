const clientSettingService = require('../../services/client/clientSettingService');

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await clientSettingService.getPublicSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
