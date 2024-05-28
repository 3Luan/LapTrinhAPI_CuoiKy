const postsModel = require("../models/postsModel");
const userModel = require("../models/UserModel");
const mongoose = require("mongoose");
const path = require("path");
const imageUploadPath = path.join("uploads/images");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Tạo bài viết
let createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files.images || [];
    const userId = req.userId;

    if (!content) {
      throw {
        code: 1,
        message: "Lỗi: Thông tin chưa đủ",
      };
    }

    let user = await userModel.findById(userId);

    if (!user) {
      throw {
        code: 1,
        message: "Lỗi: Không tìm thấy user",
      };
    }

    // Tạo một hàm để tạo tên file mới (uuid + timestamp)
    const generateUniqueFileName = (originalName) => {
      const extname = path.extname(originalName);
      const timestamp = Date.now();
      const uniqueFilename = `${uuidv4()}_${timestamp}${extname}`;
      return uniqueFilename;
    };

    const imagePaths = images.map((image) => {
      const fileName = generateUniqueFileName(image.originalname);
      const imagePath = path.join(imageUploadPath, fileName);
      fs.writeFileSync(imagePath, image.buffer);
      return { name: image.originalname, path: fileName };
    });

    const newPost = await postsModel.create({
      user: userId,
      content,
      images: imagePaths,
    });

    post = await postsModel
      .findById(newPost._id)
      .populate("user", "name avatar");
    // .select("_id title createdAt updatedAt likes");

    res.status(200).json({
      code: 0,
      message: "Tạo bài viết thành công",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: createPost",
    });
  }
};

// Lấy bài viết
let getPosts = async (req, res) => {
  try {
    const currentPage = parseInt(req.params.currentPage) || 1;

    const count = await postsModel.countDocuments({
      isDisplay: true,
      isDelete: false,
    });

    const offset = 10 * (currentPage - 1);

    const posts = await postsModel.aggregate([
      {
        //Chỉ chọn các bài viết có isDisplay là true và isDelete là false.
        $match: {
          isDisplay: true,
          isDelete: false,
        },
      },
      {
        //Sắp xếp các bài viết theo createdAt giảm dần.
        $sort: {
          createdAt: -1,
        },
      },
      {
        //Phân trang các kết quả
        $skip: offset,
      },
      {
        //Phân trang các kết quả
        $limit: 10,
      },
      {
        //Tham chiếu đến bảng users để lấy thông tin người dùng.
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        //Tách mảng user thành đối tượng đơn.
        $unwind: "$user",
      },
      {
        //Chọn các trường cần thiết và tính số lượng lượt thích và bình luận.
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: 1,
          images: 1,
          countLikes: { $size: "$likes" },
          countComments: { $size: "$comments" },
          user: {
            name: "$user.name",
            avatar: "$user.avatar",
          },
        },
      },
    ]);

    if (!posts || posts.length === 0) {
      throw {
        code: 1,
        message: "Không có bài viết nào",
      };
    }

    res.status(200).json({
      code: 0,
      message: "Lấy bài viết thành công",
      count: count,
      data: posts,
    });
  } catch (error) {
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: getPosts",
    });
  }
};

// Xóa bài viết
let deletePosts = async (req, res) => {
  try {
  } catch (error) {}
};

// Lấy thông tin chi tiết bài viết thông qua ID
let getPostsById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const postDetail = await postsModel
      .findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name pic",
        },
      })
      .populate("user", "name pic");

    if (!postDetail) {
      throw {
        code: 1,
        message: "Không tìm thấy bài viết",
      };
    }

    // Convert image data to base64 for sending to the client
    const images = postDetail.images.map((image) => ({
      contentType: image.contentType,
      data: image.data.toString("base64"),
    }));

    const postsWithImagesAndFiles = {
      ...postDetail._doc,
      images,
    };

    res.status(200).json({
      code: 0,
      message: "Lấy thông tin bài viết thành công",
      postDetail: postsWithImagesAndFiles,
    });
  } catch (error) {
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Đã có lỗi xảy ra: getPostsById",
    });
  }
};

// Lấy danh sách bài viết thông qua ID người dùng
let getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await postsModel
      .find({ user: userId })
      .populate("user")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      throw {
        code: 1,
        message: "Không có bài viết nào",
      };
    }

    // Convert image data to base64 for sending to the client
    const postsWithImagesAndFiles = posts.map((post) => {
      const images = post.images.map((image) => ({
        contentType: image.contentType,
        data: image.data.toString("base64"),
      }));

      const files = post.files.map((file) => ({
        contentType: file.contentType,
        data: file.data.toString("base64"),
        originalName: file.originalName, // Tên gốc của file
        size: file.size, // Kích thước của file trong byte
      }));

      return {
        ...post._doc,
        images,
        files,
      };
    });

    res.status(200).json({
      code: 0,
      message: "Lấy tất cả bài viết thành công",
      posts: postsWithImagesAndFiles,
    });
  } catch (error) {
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Đã có lỗi xảy ra: getPosts",
    });
  }
};

// Thích bài viết
let likePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;

    const user = await userModel.findById(userId);

    if (!user) {
      throw {
        code: 1,
        message: "Người dùng không tồn tại",
      };
    }

    const post = await postsModel.findById(postId);

    if (!post || post.isDelete || !post.isDisplay) {
      throw {
        code: 1,
        message: "Bài viết không tồn tại",
      };
    }

    // Kiểm tra xem người dùng đã thích bài viết trước đó hay chưa
    const isLiked = post.likes.find((like) => like._id === userId);
    if (isLiked) {
      throw {
        code: 1,
        message: "Bài viết này đã thích trước đó",
      };
    }

    // Nếu chưa thích, thêm id của người dùng vào mảng likes của bài viết
    const likePost = await postsModel.findByIdAndUpdate(
      postId,
      { $push: { likes: { _id: userId } } },
      { new: true }
    );

    const countLike = likePost.likes.length;

    res.status(200).json({
      code: 0,
      message: "Thích bài viết thành công",
      data: countLike,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: likePost",
    });
  }
};

// Bỏ thích bài viết
let unLikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;

    const user = await userModel.findById(userId);

    if (!user) {
      throw {
        code: 1,
        message: "Người dùng không tồn tại",
      };
    }

    const post = await postsModel.findById(postId);

    if (!post || post.isDelete || !post.isDisplay) {
      throw {
        code: 1,
        message: "Bài viết không tồn tại",
      };
    }

    // Kiểm tra xem người dùng đã thích bài viết trước đó hay chưa
    const isLiked = post.likes.find((like) => like._id === userId);
    if (!isLiked) {
      throw {
        code: 1,
        message: "Bài viết này chưa được thích",
      };
    }

    // Nếu chưa thích, thêm id của người dùng vào mảng likes của bài viết

    const unLikePost = await postsModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: { _id: userId } } },
      { new: true }
    );

    const countLike = unLikePost.likes.length;

    res.status(200).json({
      code: 0,
      message: "Bỏ thích bài viết thành công",
      data: countLike,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: unLikePost",
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePosts,
  getPostsById,
  getPostsByUserId,
  likePost,
  unLikePost,
};
