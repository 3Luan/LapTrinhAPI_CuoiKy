const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const postsSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "Users",
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        _id: {
          type: String,
          default: uuidv4,
        },
        name: String, // Tên của hình ảnh
        path: String, // Đường dẫn của hình ảnh
      },
    ],
    likes: [
      {
        _id: { type: String },
      },
    ],
    comments: [
      {
        type: String,
        ref: "Comments",
      },
    ],
    isDisplay: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const postsModel = mongoose.model("Posts", postsSchema);

module.exports = postsModel;
