const crypto = require('crypto');
const mongoose = require('mongoose');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'This email is taken'],
    match: [
      /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    minlength: [6, 'Too short!'],
    select: false,
  },
  resetPasswardToken: String,
  resetPasswardExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcript
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcript.genSalt(10);
  this.password = await bcript.hash(this.password, salt);
});

// Sign JWT and raturn
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Math user entered passwerd to hashed password in database

UserSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcript.compare(enteredPassword, this.password);
  return isMatch;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPassworToken field
  this.resetPasswardToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswardExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);