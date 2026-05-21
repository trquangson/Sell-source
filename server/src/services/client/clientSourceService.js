const SourceCode = require('../../models/SourceCode');

/**
 * Lấy danh sách source code active.
 * @returns {Array}
 */
const getPublicSources = async () => {
    return SourceCode.find({ status: 'active' }).select('-filePath').sort({ createdAt: -1 });
};

/**
 * Lấy chi tiết một source code active theo ID.
 * @param {string} id
 * @returns {object}
 */
const getSourceById = async (id) => {
    const source = await SourceCode.findOne({ _id: id, status: 'active' }).select('-filePath');
    if (!source) {
        const err = new Error('Không tìm thấy sản phẩm');
        err.statusCode = 404;
        throw err;
    }
    return source;
};

module.exports = { getPublicSources, getSourceById };
