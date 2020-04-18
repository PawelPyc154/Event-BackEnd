const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: `${process.env.FACEBOOK_APP_ID}`,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    function (accessToken, refreshToken, profile, next) {
      return next(null, profile);
    },
  ),
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: `${process.env.GOOGLE_APP_ID}`,
      clientSecret: process.env.GOOGLE_APP_ID,
    },
    function (accessToken, refreshToken, profile, next) {
      return next(null, profile);
    },
  ),
);

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: `${process.env.FACEBOOK_APP_ID}`,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://www.example.com/auth/facebook/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    },
  ),
);
