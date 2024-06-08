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
      part: "snippet, statistics",
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

// like video
const likeVideo = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId } = req.body;

    if (!videoId) {
      throw {
        code: 1,
        message: "Lỗi: Thông tin không đủ",
      };
    }

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

    // Gửi yêu cầu like video
    await youtube.videos.rate({
      id: videoId,
      rating: "like",
    });

    // Gửi yêu cầu lấy danh sách các rating của video
    const response = await youtube.videos.getRating({
      id: videoId,
    });

    // Lấy danh sách các rating
    const ratings = response.data;
    console.log("ratings", ratings);

    res.status(200).json({
      code: 0,
      message: "Thích video thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: likeVideo",
    });
  }
};

// bỏ like video
const unlikeVideo = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId } = req.body;

    if (!videoId) {
      throw {
        code: 1,
        message: "Lỗi: Thông tin không đủ",
      };
    }

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

    // Gửi yêu cầu unlike video
    await youtube.videos.rate({
      id: videoId,
      rating: "none",
    });

    // Gửi yêu cầu lấy danh sách các rating của video
    const response = await youtube.videos.getRating({
      id: videoId,
    });

    // Lấy danh sách các rating
    const ratings = response.data;
    console.log("ratings unile", ratings);

    res.status(200).json({
      code: 0,
      message: "Bỏ thích video thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: unlikeVideo",
    });
  }
};

// check người dùng đã like video đó hay chưa
const checkLikeVideo = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId } = req.body;

    if (!videoId) {
      throw {
        code: 1,
        message: "Lỗi: Thông tin không đủ",
      };
    }

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

    // Gửi yêu cầu lấy danh sách các rating của video
    const response = await youtube.videos.getRating({
      id: videoId,
    });

    // Lấy danh sách các rating
    const ratings = response.data;
    let data;

    // Kiểm tra xem user đã like video hay chưa
    if (ratings && ratings.rating === "like") {
      data = true;
    } else {
      data = false;
    }

    res.status(200).json({
      code: 0,
      message: "Kiểm tra like video thành công",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: checkLikeVideo",
    });
  }
};
const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId, commentText } = req.body;

    if (!videoId || !commentText) {
      throw {
        code: 1,
        message: "Lỗi: Thông tin không đủ",
      };
    }

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

    // Thêm bình luận vào video
    const commentResponse = await youtube.commentThreads.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: commentText,
            },
          },
        },
      },
    });

    const comment = commentResponse.data;

    res.status(200).json({
      code: 0,
      message: "Thêm bình luận vào video thành công",
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: addCommentToVideo",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId } = req.body;

    if (!commentId) {
      throw {
        code: 1,
        message: "Lỗi: Thông tin không đủ",
      };
    }

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

    // Xóa bình luận
    await youtube.comments.delete({
      id: commentId,
    });

    res.status(200).json({
      code: 0,
      message: "Xóa bình luận thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: deleteComment",
    });
  }
};

module.exports = { deleteComment };

module.exports = {
  getLikedVideos,
  likeVideo,
  unlikeVideo,
  checkLikeVideo,
  addComment,
  deleteComment,
};
