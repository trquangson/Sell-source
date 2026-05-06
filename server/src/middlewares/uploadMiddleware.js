const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check thư mục tồn tại
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'thumbnail' || file.fieldname === 'demoImages') {
            const dir = path.join(__dirname, '../../public/uploads/thumbnails');
            ensureDirExists(dir);
            cb(null, dir);
        } else if (file.fieldname === 'sourceFile') {
            const dir = path.join(__dirname, '../../storage/sources');
            ensureDirExists(dir);
            cb(null, dir);
        } else {
            cb(new Error('Trường file không hợp lệ'), null);
        }
    },
    filename: function (req, file, cb) {
        // Tạo tên file duy nhất để ko bị trùng
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail' || file.fieldname === 'demoImages') {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file định dạng hình ảnh!'), false);
        }
    }
    if (file.fieldname === 'sourceFile') {
        if (!file.mimetype.includes('zip') && !file.mimetype.includes('rar') && !file.originalname.match(/\.(zip|rar)$/)) {
            return cb(new Error('Chỉ chấp nhận file nén (zip, rar)!'), false);
        }
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // Tối đa 100mb
    }
});

exports.uploadSourceFiles = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'demoImages', maxCount: 5 },
    { name: 'sourceFile', maxCount: 1 }
]);
