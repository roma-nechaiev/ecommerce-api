const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const authorize = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw next(new AppError('Unauthorized', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    next(err);
  }
};

const isRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw next(
      new AppError(
        `Role ${req.user.role} is not allowed to acccess this resouse`,
        403,
      ),
    );
  }
  next();
};

module.exports = { authorize, isRole };
