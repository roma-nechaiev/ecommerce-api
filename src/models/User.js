const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    methods: {
      getSignedJwtToken() {
        // eslint-disable-next-line no-underscore-dangle
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      },
      async matchPassword(password) {
        const match = await bcrypt.compare(password, this.password);
        return match;
      },
      getResetPasswordToken() {
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.passwordResetToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        return resetToken;
      },
    },
  },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model('User', userSchema);
