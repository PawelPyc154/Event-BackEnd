const express = require('express');
const passport = require('passport');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  loginRegisterFbGoogle,
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
router.post(
  '/facebook/token',
  passport.authenticate('facebook-token'),
  loginRegisterFbGoogle,
);
router.post(
  '/google/token',
  passport.authenticate('google-token'),
  loginRegisterFbGoogle,
);

router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  },
);
module.exports = router;
