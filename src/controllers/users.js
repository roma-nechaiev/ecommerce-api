const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwtToken = require('../utils/jwtToken');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      users,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userdata = {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, userdata, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!user) {
      throw next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      throw next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const newUserdata = {
      username: req.body.username,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(id, newUserdata, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!user) {
      throw next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select('+password');
    if (!user) {
      throw next(new AppError('User not found', 404));
    }
    const isPasswordMatched = await user.matchPassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      throw next(new AppError('Old password is incorrect', 400));
    }
    user.password = req.body.newPassword;
    await user.save();

    jwtToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};
