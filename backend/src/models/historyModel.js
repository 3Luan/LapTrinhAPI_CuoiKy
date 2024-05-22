const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "Users",
    },
    video: {
      _id: {
        type: String,
      },
      categoryId: Number,
    },
    watchedAt: { type: Date, default: Date.now },
    count: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const historyModel = mongoose.model("Histories", historySchema);

module.exports = historyModel;
