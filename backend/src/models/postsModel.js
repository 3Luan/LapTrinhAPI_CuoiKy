const mongoose = require("mongoose");

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
        data: Buffer,
        contentType: String,
        size: Number,
      },
    ],
    files: [
      {
        data: Buffer, // Dữ liệu file dưới dạng Buffer
        contentType: String, // Loại nội dung của file
        originalName: String, // Tên gốc của file
        size: Number, // Kích thước của file trong byte
      },
    ],
    likes: [
      {
        user: { type: String },
      },
    ],
    comments: [
      {
        type: String,
        ref: "Comments",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const postsModel = mongoose.model("Posts", postsSchema);

module.exports = postsModel;
