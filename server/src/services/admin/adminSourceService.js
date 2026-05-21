const SourceCode = require('../../models/SourceCode');
const fs = require('fs');
const path = require('path');

/**
 * Xóa file vật lý khỏi ổ cứng.
 * @param {string} filePath
 */
const deleteFile = (filePath) => {
    if (!filePath) return;
    try {
        let fullPath = '';
        if (filePath.startsWith('/uploads/')) {
            fullPath = path.join(__dirname, '../../../public', filePath);
        } else {
            fullPath = path.join(__dirname, '../../../storage/sources', filePath);
        }
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.error('Lỗi khi xóa file:', err);
    }
};

/**
 * Lấy toàn bộ danh sách source code.
 * @returns {Array}
 */
const getAllSourcesForAdmin = async () => {
    return SourceCode.find().sort({ createdAt: -1 });
};

/**
 * Thêm mới một source code.
 * @param {object} body - Dữ liệu từ req.body
 * @param {object} files - Files từ req.files (multer)
 * @returns {object} Source code vừa được tạo
 */
const createSource = async (body, files) => {
    const { title, description, price, category, status } = body;

    if (!files || !files.sourceFile) {
        const err = new Error('Bắt buộc phải có file source code (zip/rar)!');
        err.statusCode = 400;
        throw err;
    }

    const sourceFilePath = files.sourceFile[0].filename;

    let thumbnailPath = '';
    if (files.thumbnail && files.thumbnail.length > 0) {
        thumbnailPath = '/uploads/thumbnails/' + files.thumbnail[0].filename;
    }

    let demoImagesPaths = [];
    if (files.demoImages && files.demoImages.length > 0) {
        demoImagesPaths = files.demoImages.map(file => '/uploads/thumbnails/' + file.filename);
    }

    const newSource = new SourceCode({
        title,
        description,
        price: Number(price),
        category: category || 'Khác',
        status: status || 'active',
        thumbnail: thumbnailPath,
        demoImages: demoImagesPaths,
        filePath: sourceFilePath,
    });

    await newSource.save();
    return newSource;
};

/**
 * Cập nhật thông tin source code (và thay thế file nếu có upload mới).
 * @param {string} id   - ID sản phẩm
 * @param {object} body - Dữ liệu từ req.body
 * @param {object} files - Files từ req.files (multer)
 * @returns {object} Source code sau khi cập nhật
 */
const updateSource = async (id, body, files) => {
    const { title, description, price, category, status } = body;

    const source = await SourceCode.findById(id);
    if (!source) {
        const err = new Error('Không tìm thấy sản phẩm');
        err.statusCode = 404;
        throw err;
    }

    const updatedData = {
        title,
        description,
        price: Number(price),
        category: category || 'Khác',
        status,
    };

    if (files && files.sourceFile) {
        deleteFile(source.filePath);
        updatedData.filePath = files.sourceFile[0].filename;
    }

    if (files && files.thumbnail && files.thumbnail.length > 0) {
        deleteFile(source.thumbnail);
        updatedData.thumbnail = '/uploads/thumbnails/' + files.thumbnail[0].filename;
    }

    if (files && files.demoImages && files.demoImages.length > 0) {
        if (source.demoImages && source.demoImages.length > 0) {
            source.demoImages.forEach(img => deleteFile(img));
        }
        updatedData.demoImages = files.demoImages.map(file => '/uploads/thumbnails/' + file.filename);
    }

    return SourceCode.findByIdAndUpdate(id, updatedData, { returnDocument: 'after' });
};

/**
 * Xóa source code và toàn bộ file vật lý liên quan.
 * @param {string} id - ID sản phẩm
 */
const deleteSource = async (id) => {
    const source = await SourceCode.findById(id);
    if (!source) {
        const err = new Error('Không tìm thấy sản phẩm');
        err.statusCode = 404;
        throw err;
    }

    deleteFile(source.filePath);
    deleteFile(source.thumbnail);
    if (source.demoImages && source.demoImages.length > 0) {
        source.demoImages.forEach(img => deleteFile(img));
    }

    await SourceCode.findByIdAndDelete(id);
};

module.exports = { getAllSourcesForAdmin, createSource, updateSource, deleteSource };
