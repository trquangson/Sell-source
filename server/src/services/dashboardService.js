const Transaction = require('../models/Transaction');
const SourceCode = require('../models/SourceCode');
const User = require('../models/User');

/**
 * Tổng hợp số liệu cho Admin Dashboard.
 * Dùng Promise.all để query song song, tránh waterfall.
 */
const getDashboardStats = async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7DaysAgo = new Date();
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
    startOf7DaysAgo.setHours(0, 0, 0, 0);

    const [
        revenueResult,
        todayRevenueResult,
        depositResult,
        totalProducts,
        totalUsers,
        totalOrders,
        recentTransactions,
        topProducts,
        rawChartData
    ] = await Promise.all([
        // Tổng doanh thu 
        Transaction.aggregate([
            { $match: { type: 'PURCHASE', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        // Doanh thu hôm nay
        Transaction.aggregate([
            {
                $match: {
                    type: 'PURCHASE',
                    status: 'completed',
                    createdAt: { $gte: startOfToday }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        // Tổng nạp tiền
        Transaction.aggregate([
            { $match: { type: 'DEPOSIT', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        SourceCode.countDocuments({ status: 'active' }),
        User.countDocuments({ role: 'user' }),
        Transaction.countDocuments({ type: 'PURCHASE', status: 'completed' }),
        // 10 giao dịch gần nhất
        Transaction.find({ status: 'completed' })
            .populate('userId', 'username fullName')
            .populate('sourceId', 'title')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        // Top 5 sản phẩm bán chạy
        SourceCode.find({ status: 'active' })
            .select('title category purchaseCount price thumbnail')
            .sort({ purchaseCount: -1 })
            .limit(5)
            .lean(),
        // Biểu đồ doanh thu 7 ngày qua
        Transaction.aggregate([
            {
                $match: {
                    type: 'PURCHASE',
                    status: 'completed',
                    createdAt: { $gte: startOf7DaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+07:00" } },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ])
    ]);

    // Chuẩn hoá dữ liệu biểu đồ: Điền 0 cho những ngày không có doanh thu
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const vnDate = new Date(d.getTime() + 7 * 60 * 60 * 1000);
        const dateStr = vnDate.toISOString().split('T')[0];

        const found = rawChartData.find(item => item._id === dateStr);
        chartData.push({
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            revenue: found ? found.revenue : 0
        });
    }

    return {
        stats: {
            totalRevenue: revenueResult[0]?.total || 0,
            todayRevenue: todayRevenueResult[0]?.total || 0,
            totalDeposit: depositResult[0]?.total || 0,
            totalProducts,
            totalUsers,
            totalOrders,
        },
        recentTransactions,
        topProducts,
        chartData
    };
};

module.exports = { getDashboardStats };
