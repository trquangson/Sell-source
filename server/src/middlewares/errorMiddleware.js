const logger = require('../utils/logger');

const sendErrorDev = (err, res) => {
    logger.error(`${err.status || 'error'} - ${err.statusCode || 500} - ${err.message}`, { stack: err.stack });
    res.status(err.statusCode || 500).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    logger.error(`${err.status || 'error'} - ${err.statusCode || 500} - ${err.message}`);
    // Lỗi có kiểm soát
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } else {
        // Lỗi hệ thống hoặc lỗi chưa biết
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Đã có lỗi xảy ra từ máy chủ!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }
};
