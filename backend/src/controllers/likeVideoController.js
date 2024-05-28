const userModel = require("../models/UserModel");
const { google } = require("googleapis");

// Lấy danh sách video mà user đã like
let getLikedVideos = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      throw {
        code: 1,
        message: "Lỗi: Người dùng không tồn tại",
      };
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({ version: "v3", auth });

    const response = await youtube.videos.list({
      part: "snippet",
      myRating: "like",
      maxResults: 25,
    });

    const likedVideos = response.data.items;

    if (!likedVideos.length) {
      throw {
        code: 1,
        message: "Không tìm thấy video đã like cho người dùng này",
      };
    }

    res.status(200).json({
      code: 0,
      message: "Lấy tất cả video đã like thành công",
      data: likedVideos,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getLikedVideos",
    });
  }
};

module.exports = { getLikedVideos };
