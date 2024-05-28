const userModel = require("../models/UserModel");
const playlistModel = require("../models/playlistModel");
const historyModel = require("../models/historyModel");
const { google } = require("googleapis");

///////////////////////// YOUTUBE /////////////////////////

// Lấy danh sách phát của người dùng
let getPlaylistId = async (req, res) => {
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

    const response = await youtube.channels.list({
      part: "id",
      mine: true,
    });

    const channels = response.data.items;

    if (!channels.length) {
      throw {
        code: 1,
        message: "Không tìm thấy kênh của người dùng",
      };
    }

    const channelId = channels[0].id;

    const playlistsResponse = await youtube.playlists.list({
      part: "snippet,contentDetails",
      channelId: channelId,
      maxResults: 25,
    });

    const playlists = playlistsResponse.data.items;

    if (!playlists.length) {
      throw {
        code: 1,
        message: "Không tìm thấy danh sách phát cho kênh này",
      };
    }

    const playlistsWithFirstVideoId = await Promise.all(
      playlists.map(async (playlist) => {
        try {
          const playlistItemsResponse = await youtube.playlistItems.list({
            part: "snippet,contentDetails",
            playlistId: playlist.id,
            maxResults: 1,
          });

          const firstVideo = playlistItemsResponse.data.items[0];
          return {
            ...playlist,
            firstVideoId: firstVideo ? firstVideo.contentDetails.videoId : "",
          };
        } catch (error) {
          console.error(
            `Failed to get first video for playlist ${playlist.id}`,
            error
          );
          return {
            ...playlist,
            firstVideoId: "",
          };
        }
      })
    );

    res.status(200).json({
      code: 0,
      message: "Lấy tất cả ID danh sách phát và video đầu tiên thành công",
      data: playlistsWithFirstVideoId,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getPlaylistId",
    });
  }
};

// Lấy danh sách video trong danh sách phát
let getPlaylistVideos = async (req, res) => {
  try {
    const { playlistId } = req.params;
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

    const response = await youtube.playlistItems.list({
      part: "snippet,contentDetails",
      playlistId: playlistId,
      maxResults: 25,
    });

    const videos = response.data.items;

    if (!videos.length) {
      throw {
        code: 1,
        message: "Không tìm thấy video trong danh sách phát này",
      };
    }

    res.status(200).json({
      code: 0,
      message: "Lấy danh sách video trong playlist thành công",
      data: videos,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getPlaylistVideos",
    });
  }
};

///////////////////////// HỆ THỐNG /////////////////////////

let checkAndCreatePlaylist = async (req, res) => {
  try {
    const { videoId, categoryId } = req.body;
    const userId = req.userId;

    if (!videoId || !categoryId) {
      throw {
        code: 1,
        message: "Lỗi: Chưa đủ thông tin",
      };
    }

    if (categoryId != 10) {
      throw {
        code: 1,
        message: "Không phải là video âm nhạc",
      };
    }

    const history = await historyModel.findOne({
      user: userId,
      "video._id": videoId,
    });

    if (history && history.count < 3) {
      throw {
        code: 1,
        message: "Chưa đủ điều kiện để tạo danh sách kết hợp",
      };
    }

    const playlists = await playlistModel.aggregate([
      { $match: { user: userId } }, // Lọc danh sách phát của người dùng
      {
        $addFields: {
          isVideoAtTop: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: ["$videos", 0] }, videoId] },
              then: true,
              else: false,
            },
          },
        },
      },
      { $match: { isVideoAtTop: true } }, // Lọc danh sách phát có videoId ở vị trí đầu tiên
    ]);

    // Nếu có ít nhất một danh sách phát có videoId ở vị trí đầu tiên
    if (playlists.length > 0) {
      // Cập nhật thời gian updateAt của playlist đầu tiên
      await playlistModel.updateOne(
        { _id: playlists[0]._id }, // Điều kiện tìm kiếm: Tìm playlist dựa trên _id
        { $set: { updatedAt: new Date() } } // Dữ liệu cập nhật: Cập nhật trường updatedAt thành thời gian hiện tại
      );

      return res.status(200).json({
        code: 0,
        message: "Cập nhật danh sách kết hợp thành công",
      });
    }

    const historyMusicList = await historyModel
      .find({
        user: userId,
        "video.categoryId": 10,
        "video._id": { $ne: videoId },
      })
      .limit(14)
      .sort({ watchedAt: -1 });

    let listVideoId = await historyMusicList.map((item) => {
      return item.video._id;
    });

    listVideoId = [videoId, ...listVideoId];

    const data = await playlistModel.create({
      user: userId,
      name: "Danh sách kết hợp",
      videos: listVideoId.map((video) => video),
    });

    console.log("data", data);

    res.status(200).json({
      code: 0,
      message: "Danh sách kết hợp được tạo tự động thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: checkAndCreatePlaylist",
    });
  }
};

// Lấy tất cả danh sách kết hợp của người dùng
let getAutoPlaylist = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      throw {
        code: 1,
        message: "Lỗi: Người dùng không tồn tại",
      };
    }

    const playlists = await playlistModel.find({ user: userId });

    const playlistsWithFirstVideo = playlists.map((playlist) => ({
      playlistId: playlist._id,
      videoId: playlist.videos[0],
    }));

    if (!playlistsWithFirstVideo.length) {
      throw {
        code: 1,
        message: "Không tìm thấy danh sách kết hợp nào",
      };
    }

    res.status(200).json({
      code: 0,
      message: "Lấy danh sách kết hợp của người dùng thành công",
      data: playlistsWithFirstVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getAutoPlaylist",
    });
  }
};

// Lấy tất cả video trong danh sách kết hợp thông qua id
let getVideoInAutoPlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const { playlistId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      throw {
        code: 1,
        message: "Lỗi: Người dùng không tồn tại",
      };
    }
    const playlists = await playlistModel.findById(playlistId);

    res.status(200).json({
      code: 0,
      message:
        "Lấy danh sách video trong danh sách kết hợp của người dùng thành công",
      data: playlists,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getVideoInAutoPlaylist",
    });
  }
};

module.exports = {
  getPlaylistId,
  getPlaylistVideos,
  checkAndCreatePlaylist,
  getAutoPlaylist,
  getVideoInAutoPlaylist,
};
