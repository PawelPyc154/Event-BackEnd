const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.select = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true });
};

// @desc         Register user
// @route        POST /api/auth/register
// @access       Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // Create user
  if (!email) {
    return next(new ErrorResponse({ email: 'Please add an email' }, 400));
  }
  if (!password) {
    return next(new ErrorResponse({ password: 'Please add a password' }, 400));
  }
  if (!name) {
    return next(new ErrorResponse({ name: 'Please add a name' }, 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  sendTokenResponse(user, 200, res);
});

// @desc         Register or login with facebook or google
// @route        POST /api/auth/facebook/token
// @route        POST /api/auth/google/token
// @access       Public
exports.LoginRegisterFbGoogle = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.user._json.email });
  if (user) {
    return sendTokenResponse(user, 200, res);
  }
  const newUser = await User.create({
    name: req.user.displayName,
    email: req.user._json.email,
  });
  if (newUser) {
    return sendTokenResponse(newUser, 200, res);
  }
});

// @desc         Login user
// @route        POST /api/auth/register
// @access       Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // validate email & password
  if (email && !password) {
    return next(
      new ErrorResponse(
        {
          password:
            'Please add a password or try login with FaceBook or Google',
        },
        401,
      ),
    );
  }
  if (!email) {
    return next(new ErrorResponse({ email: 'Please add an email' }, 400));
  }
  if (!password) {
    return next(new ErrorResponse({ password: 'Please add a password' }, 400));
  }
  // check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(
      new ErrorResponse(
        { email: 'Invalid credentials', password: 'Invalid credentials' },
        401,
      ),
    );
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(
      new ErrorResponse(
        { email: 'Invalid credentials', password: 'Invalid credentials' },
        401,
      ),
    );
  }
  sendTokenResponse(user, 200, res);
});

// @desc         Get current logged in user
// @route        POST /api/auth/me
// @access       Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc         Logout clear cookie
// @route        get /api/auth/logout
// @access       Private
exports.logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({ success: true, date: {} });
});

// @desc         Update user detils
// @route        PUT /api/auth/updatedetails
// @access       Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = { name: req.body.name, email: req.body.email };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc         Forgot password
// @route        POST /api/auth/forgotpassword
// @access       Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email becaouse you (or somone else)has requested the reset of a password.Please make a PUT request to : \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswardToken = undefined;
    user.resetPasswardExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be send', 500));
  }

  // res.status(200).json({ success: true, data: user });
});

// @desc         Reset password
// @route        PUT /api/auth/resetpassword/:reserttoken
// @access       Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswardToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswardToken,
    resetPasswardExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswardToken = undefined;
  user.resetPasswardExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});
