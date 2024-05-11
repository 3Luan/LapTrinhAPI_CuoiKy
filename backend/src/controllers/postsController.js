const postsModel = require("../models/postsModel");
const userModel = require("../models/UserModel");
const mongoose = require("mongoose");

let createPosts = async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files.images || [];
    const files = req.files.files || [];

    userId = req.userId;

    if (!userId || !content) {
      throw {
        code: 1,
        message: "Lỗi khi tạo bài viết: Thông tin chưa đủ",
      };
    }

    // Convert images
    const imageObjects = images.map((image) => ({
      data: image.buffer,
      contentType: image.mimetype,
      size: image.size,
    }));

    // Convert files
    const fileObjects = files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    }));

    // Tạo bài viết mới
    newPost = await postsModel.create({
      user: userId,
      content,
      images: imageObjects,
      files: fileObjects,
    });

    const post = await postsModel.findById(newPost._id).populate("user");

    // Convert image data to base64 for sending to the client
    const image = post.images.map((image) => ({
      contentType: image.contentType,
      data: image.data.toString("base64"),
    }));

    const file = post.files.map((file) => ({
      contentType: file.contentType,
      data: file.data.toString("base64"),
      originalName: file.originalName, // Tên gốc của file
      size: file.size, // Kích thước của file trong byte
    }));

    const postsWithImagesAndFiles = {
      ...post._doc,
      images: image,
      files: file,
    };

    res.status(200).json({
      code: 0,
      message: "Tạo bài viết thành công",
      post: postsWithImagesAndFiles,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Đã có lỗi xảy ra: createPosts",
    });
  }
};

let getPosts = async (req, res) => {
  try {
    const posts = await postsModel
      .find()
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

let deletePosts = async (req, res) => {
  try {
  } catch (error) {}
};

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
      // .populate({
      //   path: "comments",
      //   populate: {
      //     path: "replies",
      //     populate: {
      //       path: "user",
      //       select: "name pic",
      //     },
      //   },
      // })
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

    const files = postDetail.files.map((file) => ({
      contentType: file.contentType,
      data: file.data.toString("base64"),
      originalName: file.originalName, // Tên gốc của file
      size: file.size, // Kích thước của file trong byte
    }));

    const postsWithImagesAndFiles = {
      ...postDetail._doc,
      images,
      files,
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

let toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    if (!postId) {
      throw {
        code: 1,
        message: "Lỗi: không tìm thấy postId",
      };
    }

    let user = await userModel.findById(userId);
    if (!user) {
      throw {
        code: 1,
        message: "Đã có lỗi xảy ra: Không tìm thấy user",
      };
    }

    let post = await postsModel.findById(postId);
    if (!post) {
      throw {
        code: 1,
        message: "Đã có lỗi xảy ra: Không tìm thấy bài viết",
      };
    }

    // Tìm user like trong post của người dùng
    const existingUserIndex = post.likes.findIndex(
      (item) => item.user === userId
    );

    if (existingUserIndex !== -1) {
      // Nếu user đã tồn tại - xóa user đó ra
      post.likes.splice(existingUserIndex, 1);

      res.status(200).json({
        code: 0,
        message: "UnLike thành công",
        like: post.likes,
      });

      await post.save();
      return;
    } else {
      // Nếu user chưa có trong likes, thêm mới vào
      post.likes.unshift({ user: userId });

      res.status(200).json({
        code: 0,
        message: "Like thành công",
        like: post.likes,
      });

      await post.save();
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Đã có lỗi xảy ra: toggleLikePost",
    });
  }
};

module.exports = {
  getPosts,
  createPosts,
  deletePosts,
  getPostsById,
  getPostsByUserId,
  toggleLikePost,
};
