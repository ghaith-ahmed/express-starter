const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");
const User = require("../models/userModel");
const options = {
  jwtFromRequest: (req) => {
    if (req && req.cookies) {
      return req.cookies["jwt"];
    }
  },
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId).select("-password");
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);
