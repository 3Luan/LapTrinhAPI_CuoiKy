const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(profile);
    }
  )
);
