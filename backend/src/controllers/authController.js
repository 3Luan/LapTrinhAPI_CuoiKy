const jwtActions = require("../middleware/jwtActions");
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("dotenv").config();

const loginWithGoogle = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const loginWithGoogleCallback = (req, res, next) => {
  passport.authenticate("google", async (profile) => {
    // Logic xử lý sau khi đăng nhập thành công
    try {
      if (!profile) {
        throw {
          code: 1,
          message: "Đăng nhập thất bại. Hãy thử lại",
        };
      }

      let user = await userModel.findById(profile.id);

      if (user) {
        user.name = profile.displayName;
        user.email = profile.emails;
        user.avatar = profile.photos[0].value;
      } else {
        user = await userModel.create({
          _id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
      }

      let payload = {
        id: user._id,
      };

      const token = jwtActions.createJWT(payload);

      // Lưu token vào cookie
      res.cookie("token", token, {
        httpOnly: true,
        // path: "/api/auth/refresh",
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
        message: "Đã có lỗi xảy ra khi refresh1",
      };
    }

    let user = await userModel.findById(userId);

    if (!user) {
      throw {
        code: 1,
        message: "Đã có lỗi xảy ra khi refresh2",
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
      message: error.message || "Đã có lỗi xảy ra: refresh",
    });
  }
};

module.exports = {
  loginWithGoogle,
  loginWithGoogleCallback,
  logout,
  refresh,
};
