const express = require('express');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  LoginRegisterFbGoogle,
  logout,
} = require('../controllers/auth');
require('colors');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post(
  '/facebook/token',
  passport.authenticate('facebook-token'),
  LoginRegisterFbGoogle,
);
router.post(
  '/google/token',
  passport.authenticate('google-token'),
  LoginRegisterFbGoogle,
);

router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
);
module.exports = router;
