require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const indexRoutes = require("./routes/indexRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

const database = require("./config/database");

app.use(cors({
    origin: 'http://localhost:5173', // Domain của frontend
    credentials: true // Cho phép gửi cookie
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Đăng ký API routes
indexRoutes(app);

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.send('Server đang chạy!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

database.connect()