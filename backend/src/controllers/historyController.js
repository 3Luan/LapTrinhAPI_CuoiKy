const userModel = require("../models/UserModel");
const historyModel = require("../models/historyModel");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 10 });

let addHistory = async (req, res) => {
  try {
    const { videoId, categoryId } = req.body;
    const userId = req.userId;

    // Kiểm tra nếu yêu cầu này đã được xử lý trong 10 giây qua
    const cacheKey = `${userId}-${videoId}`;
    if (myCache.has(cacheKey)) {
      return res.status(200).json({
        code: 0,
        message: "Yêu cầu đã được xử lý trước đó, vui lòng thử lại sau.",
      });
    }

    // Đánh dấu yêu cầu này đã được xử lý
    myCache.set(cacheKey, true);

    // Tìm người dùng
    const user = await userModel.findById(userId);

    // Nếu người dùng không tồn tại
    if (!user) {
      throw {
        code: 1,
        message: "Lỗi: Người dùng không tồn tại",
      };
    }

    // Tìm video trong lịch sử của người dùng
    let historyEntry = await historyModel.findOne({
      user: userId,
      "video._id": videoId,
    });

    if (historyEntry) {
      // Nếu video đã tồn tại, cập nhật thời gian và tăng số lần xem
      historyEntry.watchedAt = Date.now();
      historyEntry.count += 1;
    } else {
      // Nếu video chưa có trong lịch sử, thêm mới vào lịch sử
      historyEntry = new historyModel({
        user: userId,
        video: { _id: videoId, categoryId: categoryId },
        watchedAt: Date.now(),
      });
    }

    // Lưu trữ lịch sử đã cập nhật
    await historyEntry.save();

    res.status(200).json({
      code: 0,
      message: "addHistory thành công",
      data: historyEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: addHistory",
    });
  }
};

let getHistory = async (req, res) => {
  try {
    const userId = req.userId;

    // Tìm lịch sử xem video của người dùng theo userId
    const history = await historyModel
      .find({ user: userId })
      .sort({ watchedAt: -1 });

    // Trả về lịch sử của người dùng
    res.status(200).json({
      code: 0,
      message: "Lấy video đã xem thành công",
      data: history,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getHistory",
    });
  }
};

module.exports = {
  addHistory,
  getHistory,
};
