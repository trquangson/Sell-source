const Setting = require('../models/Setting');

const DEFAULT_SETTINGS = {
    'site.name': 'Code247',
    'site.description': 'Nền tảng mua bán mã nguồn chất lượng cao, an toàn và uy tín.',
    'site.favicon': '',
    'site.email': '',
    'site.phone': '',
    'site.zalo': '',
    'site.facebook': '',
    'payment.bankName': '',
    'payment.accountNumber': '',
    'payment.accountHolder': '',
    'payment.transferPrefix': 'naptien',
    'payment.sepayWebhookApiKey': '',
};

const getAllSettings = async () => {
    const rows = await Setting.find({});
    const result = { ...DEFAULT_SETTINGS };
    rows.forEach(row => { result[row.key] = row.value; });
    return result;
};

/**
 * Lấy 1 setting theo key 
 */
const getSetting = async (key) => {
    const all = await getAllSettings();
    return all[key] ?? DEFAULT_SETTINGS[key] ?? null;
};

const updateSettings = async (data) => {
    // Chỉ cho phép update các key hợp lệ đã định nghĩa
    const allowedKeys = Object.keys(DEFAULT_SETTINGS);

    const ops = Object.entries(data)
        .filter(([key]) => allowedKeys.includes(key))
        .map(([key, value]) => ({
            updateOne: {
                filter: { key },
                update: { $set: { key, value } },
                upsert: true
            }
        }));

    if (ops.length > 0) {
        await Setting.bulkWrite(ops);
    }
};

/**
 * Lấy chỉ các settings public 
 */
const getPublicSettings = async () => {
    const all = await getAllSettings();
    const PUBLIC_KEYS = [
        'site.name', 'site.description', 'site.favicon',
        'site.email', 'site.phone', 'site.zalo', 'site.facebook',
        'payment.bankName', 'payment.accountNumber',
        'payment.accountHolder', 'payment.transferPrefix',
    ];
    return Object.fromEntries(PUBLIC_KEYS.map(k => [k, all[k]]));
};

module.exports = { getAllSettings, getSetting, updateSettings, getPublicSettings };
