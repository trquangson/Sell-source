require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Security & Logging middlewares
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const logger = require('./utils/logger');
const errorMiddleware = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');

const indexRoutes = require("./routes/indexRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

const database = require("./config/database");

app.set('trust proxy', 1);

app.use(helmet({
    crossOriginResourcePolicy: false, // Cho phép load ảnh/file tĩnh từ client (khác port)
}));

// Ghi log HTTP requests
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
    }));
}

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true // Cho phép gửi cookie
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Chống NoSQL injection
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.query) mongoSanitize.sanitize(req.query);
    if (req.params) mongoSanitize.sanitize(req.params);
    next();
});

// Phục vụ file tĩnh 
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.send('Server đang chạy!');
});

indexRoutes(app);

app.all('/{*splat}', (req, res, next) => {
    next(new AppError(`Không tìm thấy đường dẫn ${req.originalUrl} trên máy chủ!`, 404));
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    logger.info(`Server đang chạy tại port:${PORT}`);
});

database.connect();

// Xử lý các lỗi chưa được catch 
process.on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...');
    logger.error(`${err.name}: ${err.message}`);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! Shutting down...');
    logger.error(`${err.name}: ${err.message}`);
    process.exit(1);
});