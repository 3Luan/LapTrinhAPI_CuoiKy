const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videos: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const playlistModel = mongoose.model("Playlists", playlistSchema);

module.exports = playlistModel;
