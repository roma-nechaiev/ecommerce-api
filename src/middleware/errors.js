const debug = require('debug')('app:errors');
const {
  JsonWebTokenError,
  TokenExpiredError,
} = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    error = new AppError(`Duplicate ${Object.keys(err.keyValue)} entered`, 400);
  }
  if (err.name === 'CastError') {
    error = new AppError(`Resource not found with id of ${err.value}`, 404);
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }
  if (err instanceof JsonWebTokenError) {
    error = new AppError('Invalid token', 401);
  }
  if (err instanceof TokenExpiredError) {
    error = new AppError('Token expired', 401);
  }

  if (process.env.NODE_ENV === 'development') {
    debug(err.stack);
  }
  return res.status(error.statusCode).json({
    status: 'error',
    error: {
      statusCode: error.statusCode,
      message: error.message,
    },
  });
};
