const dashboardService = require('../../services/admin/dashboardService');

exports.getDashboardStats = async (req, res) => {
    try {
        const data = await dashboardService.getDashboardStats();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
