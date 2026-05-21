const clientSourceService = require('../../services/client/clientSourceService');

exports.getPublicSources = async (req, res) => {
    try {
        const sources = await clientSourceService.getPublicSources();
        res.status(200).json({ success: true, data: sources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.getSourceById = async (req, res) => {
    try {
        const source = await clientSourceService.getSourceById(req.params.id);
        res.status(200).json({ success: true, data: source });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};
