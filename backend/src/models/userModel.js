const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    avatar: { type: String },
    // posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlists" }],
    history: [
      {
        videoId: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    saved: [
      {
        videoId: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
