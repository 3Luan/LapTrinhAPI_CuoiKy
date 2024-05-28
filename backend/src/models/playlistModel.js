const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const playlistSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    user: {
      type: String,
      ref: "Users",
    },
    name: { type: String },
    videos: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const playlistModel = mongoose.model("Playlists", playlistSchema);

module.exports = playlistModel;
