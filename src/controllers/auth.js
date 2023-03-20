const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwtToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    jwtToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      throw new AppError('Invalid Credentials', 401);
    }
    const user = await User.findOne({ $or: [{ username }, { email }] }).select(
      '+password',
    );
    if (!user) {
      throw new AppError('Invalid Credentials', 401);
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new AppError('Invalid Credentials', 401);
    }

    jwtToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const token = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid token', 400);
    }
    if (req.body.password !== req.body.confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    jwtToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  register, login, logout, forgotPassword, resetPassword,
};
