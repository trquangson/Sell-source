const User = require('../../models/User');
const passwordHelper = require('../../utils/passwordHelper');
const jwtHelper = require('../../utils/jwtHelper');
const crypto = require('crypto');
const emailHelper = require('../../utils/emailHelper');

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

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống!');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
        <h2>Khôi phục mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào đường dẫn bên dưới để thiết lập mật khẩu mới (có hiệu lực trong 10 phút):</p>
        <a href="${resetUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    `;

    try {
        await emailHelper.sendEmail({
            to: user.email,
            subject: 'Yêu cầu khôi phục mật khẩu',
            html: message
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        throw new Error('Lỗi gửi email. Vui lòng thử lại sau!');
    }
};

exports.resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn!');
    }

    const hashedPassword = await passwordHelper.hashPassword(newPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
};
