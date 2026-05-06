const User = require('../models/User');
const passwordHelper = require('../utils/passwordHelper');
const jwtHelper = require('../utils/jwtHelper');

exports.registerUser = async (data) => {
    const { username, email, password, fullName } = data;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new Error('Username hoặc email đã tồn tại!');
    }

    const hashedPassword = await passwordHelper.hashPassword(password);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        fullName
    });

    await newUser.save();
    return newUser;
};

exports.loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
    }

    const isMatch = await passwordHelper.comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
    }

    const payload = {
        userId: user._id,
        role: user.role
    };
    const token = jwtHelper.generateToken(payload);

    const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        balance: user.balance,
        role: user.role,
        avatar: user.avatar
    };

    return { token, user: userResponse };
};

//Lấy thông tin user
exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    return user;
};
