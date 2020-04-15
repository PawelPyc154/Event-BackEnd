const FacebookStrategy = require('passport-facebook').Strategy;

exports.fbPassportStrategy = new FacebookStrategy(
  {
    clientID: `${process.env.FACEBOOK_APP_ID}`,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
  },
  (accessToken, refreshToken, profile, cb) =>
    // User.findOrCreate({facebookId: profile.id}, function (err, user) {
    //     return cb(err, user);
    // });

    cb(null, profile),
);
