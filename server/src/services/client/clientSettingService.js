const Setting = require('../../models/Setting');

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

module.exports = { getPublicSettings };
