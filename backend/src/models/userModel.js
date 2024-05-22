const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: { type: String, require: true },
    description: { type: String, require: true },
    customUrl: { type: String, require: true },
    publishedAt: { type: String, require: true },
    country: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    coverAvatar: {
      type: String,
      default:
        "https://yt3.googleusercontent.com/KbPMUbosgKFr-A5ihp_5n39G-XJnOY3Un6CnAxfqLpWh6Lh0pm_1SXc-uwCAk2DgO1-PG8lO",
    },
    subscriberCount: {
      type: String,
    },
    accessToken: { type: String, require: true },
    refreshToken: { type: String, require: true },
    // posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    history: [
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
