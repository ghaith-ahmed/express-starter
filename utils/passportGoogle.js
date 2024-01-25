const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${
        process.env.PORT || 5200
      }/api/users/google/callback`,
      passReqToCallback: true,
    },
    async function (accessToken, refreshToken, _, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id }).select(
          "-password"
        );
        if (user) {
          let token = generateToken(user._id);
          return done(null, token);
        }
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        token = generateToken(user._id);
        return done(null, token);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});
