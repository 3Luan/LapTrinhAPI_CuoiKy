const jwtActions = require("../middleware/jwtActions");
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("dotenv").config();

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
      if (!data.profile) {
        throw {
          code: 1,
          message: "Đăng nhập thất bại. Hãy thử lại",
        };
      }

      let user = await userModel.findOne({ _id: data.profile.id });

      if (user) {
        user = await userModel.findOneAndUpdate(
          { _id: data.profile.id },
          {
            $set: {
              name: data.profile.displayName,
              email: data.profile.emails[0].value,
              avatar: data.profile.photos[0].value,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            },
          },
          { new: true }
        );
      } else {
        user = await userModel.create({
          _id: data.profile.id,
          name: data.profile.displayName,
          email: data.profile.emails[0].value,
          avatar: data.profile.photos[0].value,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }

      let payload = {
        id: user._id,
      };

      const token = jwtActions.createJWT(payload);

      // Lưu token vào cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      });

      res.redirect(`${process.env.URL_FRONTEND}`);
    } catch (error) {
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
