const postsModel = require("../models/postsModel");
const userModel = require("../models/UserModel");
const mongoose = require("mongoose");
const path = require("path");
const imageUploadPath = path.join("uploads/images");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const adminModel = require("../models/adminModel");

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
      .populate("user", "_id name avatar");
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
            _id: "$user._id",
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

// Cập nhật bài viết
const updatePost = async (req, res) => {
  try {
    const { content, postId, imagesOld } = req.body;
    const images = req.files.images || [];
    const userId = req.userId;

    // Kiểm tra xem bài viết có tồn tại không
    const postOld = await postsModel.findById(postId);
    if (!postOld) {
      return res.status(404).json({
        code: 1,
        message: "Lỗi: Bài viết không tồn tại",
      });
    }

    if (postOld.isDelete) {
      return res.status(404).json({
        code: 1,
        message: "Lỗi: Bài viết đã bị xóa trước đó",
      });
    }

    // Kiểm tra xem nội dung và tiêu đề có được cung cấp không
    if (!content) {
      return res.status(400).json({
        code: 1,
        message: "Lỗi: Thông tin không đủ",
      });
    }

    // Kiểm tra xem người dùng có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      throw {
        code: 1,
        message: "Lỗi: Người dùng không tồn tại",
      };
    }

    if (user.isBan) {
      throw {
        code: 1,
        message: "Tài khoản này đã bị khóa",
      };
    }

    // Tạo một hàm để tạo tên file mới (uuid + timestamp)
    const generateUniqueFileName = (originalName) => {
      const extname = path.extname(originalName);
      const timestamp = Date.now();
      const uniqueFilename = `${uuidv4()}_${timestamp}${extname}`;
      return uniqueFilename;
    };

    // Xác định các ID của các hình ảnh cũ từ đối tượng imagesOld
    if (imagesOld) {
      if (!Array.isArray(imagesOld)) {
        const imagesToRemove = postOld.images.filter(
          (image) => !imagesOld.includes(image._id)
        );

        imagesToRemove.forEach(async (image) => {
          await postModel.updateOne(
            { _id: postId },
            { $pull: { images: { _id: image._id } } }
          );
        });
      } else {
        const imagesToRemove = postOld.images.filter(
          (image) => !imagesOld.includes(image._id)
        );

        imagesToRemove.forEach(async (image) => {
          await postModel.updateOne(
            { _id: postId },
            { $pull: { images: { _id: image._id } } }
          );
        });
      }
    }

    const imagePaths = images.map((image) => {
      const fileName = generateUniqueFileName(image.originalname);
      const imagePath = path.join(imageUploadPath, fileName);
      fs.writeFileSync(imagePath, image.buffer);
      return { name: image.originalname, path: fileName };
    });

    // Cập nhật bài viết
    const updateData = {
      user: userId,
      content,
      isDisplay: true,
      $push: { images: { $each: imagePaths } },
    };

    await postsModel.updateOne({ _id: postId }, updateData);

    // Lấy bài viết đã cập nhật và trả về
    const updatedPost = await postModel
      .findById(postId)
      .populate("user", "_id name pic")
      .select("_id title createdAt updatedAt likes");

    res.status(200).json({
      code: 0,
      message: "Sửa bài viết thành công",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: error.code || 1,
      message: error.message || "Lỗi: updatePost",
    });
  }
};

// Xóa bài viết
let deletePost = async (req, res) => {
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
        message: "Lỗi: Không tìm thấy user",
      };
    }

    if (user.isBan) {
      throw {
        code: 1,
        message: "Tài khoản này đã bị khóa",
      };
    }

    const post = await postsModel.findById(postId);

    if (!post) {
      throw {
        code: 1,
        message: "Lỗi: Không tìm thấy bài viết",
      };
    }

    if (post.isDelete) {
      throw {
        code: 1,
        message: "Bài viết đã được xóa trước đó",
      };
    }

    if (!user.isAdmin && !(user._id === post.user)) {
      throw {
        code: 1,
        message: "Lỗi: user không có quyền",
      };
    }

    await postsModel.findByIdAndUpdate(
      postId,
      { isDelete: true },
      { new: true }
    );

    res.status(200).json({
      code: 0,
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      code: error.code || 1,
      message: error.message || "Lỗi: deletePost",
    });
  }
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

    const currentPage = parseInt(req.params.currentPage) || 1;

    const count = await postsModel.countDocuments({
      isDisplay: true,
      isDelete: false,
    });

    const offset = 10 * (currentPage - 1);

    const posts = await postsModel.aggregate([
      {
        // Chỉ chọn các bài viết có isDisplay là true và isDelete là false.
        $match: {
          isDisplay: true,
          isDelete: false,
          user: userId, // Lọc theo userId
        },
      },
      {
        // Sắp xếp các bài viết theo createdAt giảm dần.
        $sort: {
          createdAt: -1,
        },
      },
      {
        // Phân trang các kết quả
        $skip: offset,
      },
      {
        // Phân trang các kết quả
        $limit: 10,
      },
      {
        // Tham chiếu đến bảng users để lấy thông tin người dùng.
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        // Tách mảng user thành đối tượng đơn.
        $unwind: "$user",
      },
      {
        // Chọn các trường cần thiết và tính số lượng lượt thích và bình luận.
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
      message: error.message || "Lỗi: getPostsByUserId",
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

//////////////////////// Admin //////////////////////

let getDeletePosts = async (req, res) => {
  try {
    const currentPage = parseInt(req.params.currentPage) || 1;
    const adminId = req.adminId;

    let admin = await adminModel.findById(adminId);

    let posts, count;

    if (!admin) {
      throw {
        code: 1,
        message: "Lỗi: Không tìm thấy admin",
      };
    }

    count = await postsModel.countDocuments({
      isDelete: true,
    });

    const offset = 10 * (currentPage - 1);

    posts = await postsModel
      .find({ isDelete: true })
      .limit(10)
      .skip(offset)
      .populate("user", "_id name avatar customUrl")
      .sort({ createdAt: -1 });

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
      message: error.message || "Lỗi: getDeletePosts",
    });
  }
};

// let getPostsStatistics = async (req, res) => {
//   try {
//     const { day, month, year } = req.params;

//     const adminId = req.adminId;
//     let admin = await adminModel.findById(adminId);
//     if (!admin) {
//       throw {
//         code: 1,
//         message: "Lỗi: không tin thấy admin",
//       };
//     }

//     let query = {
//       isDelete: false,
//       isDoc: false,
//     };

//     if (day !== "null" && month && year) {
//       const startDate = new Date(`${year}-${month}-${day}`);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     } else if (month !== "null" && year) {
//       const startDate = new Date(`${year}-${month}-01`);
//       const nextMonth = parseInt(month) + 1;
//       const endDate = new Date(`${year}-${nextMonth}-01`);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     } else if (year) {
//       const startDate = new Date(`${year}-01-01`);
//       const endDate = new Date(`${parseInt(year) + 1}-01-01`);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     }

//     const count = await postModel.countDocuments(query);

//     res.status(200).json({
//       code: 0,
//       message: "Thống kê thành công",
//       count: count,
//     });
//   } catch (error) {
//     res.status(200).json({
//       code: error.code || 1,
//       message: error.message || "Lỗi: getPostsStatistics",
//     });
//   }
// };

// let getUnapprovedPostsStatistics = async (req, res) => {
//   try {
//     const { day, month, year } = req.params;

//     const adminId = req.adminId;
//     let admin = await adminModel.findById(adminId);
//     if (!admin) {
//       throw {
//         code: 1,
//         message: "Lỗi: không tin thấy admin",
//       };
//     }

//     let query = {
//       isDisplay: false,
//       isDelete: false,
//       isDoc: false,
//     };

//     if (day !== "null" && month && year) {
//       const startDate = new Date(`${year}-${month}-${day}`);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     } else if (month !== "null" && year) {
//       const startDate = new Date(`${year}-${month}-01`);
//       const nextMonth = parseInt(month) + 1;
//       const endDate = new Date(`${year}-${nextMonth}-01`);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     } else if (year) {
//       const startDate = new Date(`${year}-01-01`);
//       const endDate = new Date(`${parseInt(year) + 1}-01-01`);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     }

//     const count = await postModel.countDocuments(query);

//     res.status(200).json({
//       code: 0,
//       message: "Thống kê thành công",
//       count: count,
//     });
//   } catch (error) {
//     res.status(200).json({
//       code: error.code || 1,
//       message: error.message || "Lỗi: getUnapprovedPostsStatistics",
//     });
//   }
// };

// let getapprovedPostsStatistics = async (req, res) => {
//   try {
//     const { day, month, year } = req.params;

//     const adminId = req.adminId;
//     let admin = await adminModel.findById(adminId);
//     if (!admin) {
//       throw {
//         code: 1,
//         message: "Lỗi: không tin thấy admin",
//       };
//     }

//     let query = {
//       isDisplay: true,
//       isDelete: false,
//       isDoc: false,
//     };

//     if (day !== "null" && month && year) {
//       const startDate = new Date(`${year}-${month}-${day}`);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     } else if (month !== "null" && year) {
//       const startDate = new Date(`${year}-${month}-01`);
//       const nextMonth = parseInt(month) + 1;
//       const endDate = new Date(`${year}-${nextMonth}-01`);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     } else if (year) {
//       const startDate = new Date(`${year}-01-01`);
//       const endDate = new Date(`${parseInt(year) + 1}-01-01`);
//       query.updatedAt = { $gte: startDate, $lt: endDate };
//     }

//     const count = await postModel.countDocuments(query);

//     res.status(200).json({
//       code: 0,
//       message: "Thống kê thành công",
//       count: count,
//     });
//   } catch (error) {
//     res.status(200).json({
//       code: error.code || 1,
//       message: error.message || "Lỗi: getapprovedPostsStatistics",
//     });
//   }
// };

// let getPostDeleteDetailById = async (req, res) => {
//   try {
//     const postId = req.params.postId;

//     const adminId = req.adminId;
//     let admin = await adminModel.findById(adminId);
//     if (!admin) {
//       throw {
//         code: 1,
//         message: "Lỗi: không tin thấy admin",
//       };
//     }

//     const postDetail = await postModel
//       .findById(postId)
//       .select("-comments")
//       .populate("user", "name pic");

//     if (!postDetail || postDetail.isDoc) {
//       throw {
//         code: 1,
//         message: "Không tìm thấy bài viết",
//       };
//     }

//     if (!postDetail.isDelete) {
//       throw {
//         code: 1,
//         message: "Bài viết chưa được xóa",
//       };
//     }

//     res.status(200).json({
//       code: 0,
//       message: "Lấy thông tin bài viết thành công",
//       data: postDetail,
//     });
//   } catch (error) {
//     res.status(200).json({
//       code: error.code || 1,
//       message: error.message || "Lỗi: getPostDeleteDetailById",
//     });
//   }
// };

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostsById,
  getPostsByUserId,
  likePost,
  unLikePost,

  /////////////admin///////////////
  getDeletePosts,
  // getPostsStatistics,
  // getUnapprovedPostsStatistics,
  // getapprovedPostsStatistics,
  // getPostDeleteDetailById,
};
