const jwtActions = require("../middleware/jwtActions");
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("dotenv").config();
const { google } = require("googleapis");

const loginWithGoogle = (req, res, next) => {
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/youtube",
      // "https://www.googleapis.com/auth/drive",
      "profile",
      "email",
    ],
  })(req, res, next);
};

const loginWithGoogleCallback = (req, res, next) => {
  passport.authenticate("google", async (data) => {
    try {
      if (!data.accessToken || !data.profile) {
        throw {
          code: 1,
          message: "Đăng nhập thất bại. Hãy thử lại",
        };
      }

      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: data.accessToken });

      const youtube = google.youtube({ version: "v3", auth: oauth2Client });
      const response = await youtube.channels.list({
        part: "snippet,statistics,brandingSettings",
        mine: true,
      });

      if (!response.data.items.length) {
        throw {
          code: 1,
          message: "Không tìm thấy kênh YouTube của người dùng",
        };
      }

      const youtubeProfile = response.data.items[0];
      console.log("youtubeProfile", response.data.items[0].brandingSettings);
      let userData = await userModel.findOne({ _id: youtubeProfile.id });

      if (userData) {
        userData = await userModel.findOneAndUpdate(
          { _id: youtubeProfile.id },
          {
            $set: {
              name: youtubeProfile.snippet.title,
              description: youtubeProfile.snippet.description,
              customUrl: youtubeProfile.snippet.customUrl,
              publishedAt: youtubeProfile.snippet.publishedAt,
              country: youtubeProfile.snippet.country,
              email: data.profile.emails[0].value,
              avatar: youtubeProfile.snippet.thumbnails.high.url,
              coverAvatar:
                youtubeProfile?.brandingSettings?.image?.bannerExternalUrl ||
                "",
              subscriberCount: youtubeProfile.statistics.subscriberCount,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            },
          },
          { new: true }
        );
      } else {
        userData = await userModel.create({
          _id: youtubeProfile.id,
          name: youtubeProfile.snippet.title,
          description: youtubeProfile.snippet.description,
          customUrl: youtubeProfile.snippet.customUrl,
          publishedAt: youtubeProfile.snippet.publishedAt,
          country: youtubeProfile.snippet.country,
          email: data.profile.emails[0].value,
          avatar: youtubeProfile.snippet.thumbnails.high.url,
          coverAvatar:
            youtubeProfile?.brandingSettings?.image?.bannerExternalUrl || "",
          subscriberCount: youtubeProfile.statistics.subscriberCount,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }

      let payload = {
        id: userData._id,
      };

      const token = jwtActions.createJWT(payload);

      // Lưu token vào cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      });

      res.redirect(`${process.env.URL_FRONTEND}`);
    } catch (error) {
      console.log(error);
      res.redirect("http://localhost:3001/api/auth/google");
    }
  })(req, res, next);
};

let logout = async (req, res) => {
  try {
    // xóa cookie
    res.clearCookie("token");

    res.status(200).json({
      code: 0,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Đã có lỗi xảy ra: logout",
    });
  }
};

let refresh = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw {
        code: 1,
        message: "Không tìm thấy userId",
      };
    }

    let user = await userModel.findById(userId);

    if (!user) {
      throw {
        code: 1,
        message: "User không tồn tại",
      };
    }

    res.status(200).json({
      code: 0,
      message: "Refresh thành công",
      user,
    });
  } catch (error) {
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: refresh",
    });
  }
};

module.exports = {
  loginWithGoogle,
  loginWithGoogleCallback,
  logout,
  refresh,
};
