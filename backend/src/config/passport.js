const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: [
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube",
      ],
      accessType: "offline", // Đảm bảo bạn yêu cầu refreshToken
      prompt: "consent", // Đảm bảo người dùng sẽ thấy màn hình yêu cầu quyền
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let data = {
          profile: profile,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        return cb(data);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
