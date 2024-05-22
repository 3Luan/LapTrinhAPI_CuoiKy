const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
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
