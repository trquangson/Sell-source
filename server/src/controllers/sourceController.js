const sourceService = require('../services/sourceService');

// [ADMIN] 

exports.getAllSourcesForAdmin = async (req, res) => {
    try {
        const sources = await sourceService.getAllSourcesForAdmin();
        res.status(200).json({ success: true, data: sources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

exports.createSource = async (req, res) => {
    try {
        const newSource = await sourceService.createSource(req.body, req.files);
        res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công!', data: newSource });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Đã có lỗi xảy ra khi thêm sản phẩm' });
    }
};

exports.updateSource = async (req, res) => {
    try {
        const updatedSource = await sourceService.updateSource(req.params.id, req.body, req.files);
        res.status(200).json({ success: true, message: 'Cập nhật thành công', data: updatedSource });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};

exports.deleteSource = async (req, res) => {
    try {
        await sourceService.deleteSource(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công' });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};

// [PUBLIC] 

exports.getPublicSources = async (req, res) => {
    try {
        const sources = await sourceService.getPublicSources();
        res.status(200).json({ success: true, data: sources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.getSourceById = async (req, res) => {
    try {
        const source = await sourceService.getSourceById(req.params.id);
        res.status(200).json({ success: true, data: source });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
};



