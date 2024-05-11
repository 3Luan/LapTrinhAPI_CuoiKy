const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "Users",
    },
    content: {
      type: String,
      required: true,
    },

    replies: [
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

const commentModel = mongoose.model("Comments", commentSchema);

module.exports = commentModel;
