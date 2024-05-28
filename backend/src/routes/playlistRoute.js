const express = require("express");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

///////////////////////// YOUTUBE /////////////////////////

router.get("/getPlaylistId", checkJWT, playlistController.getPlaylistId);

router.get(
  "/getPlaylistVideos/:playlistId",
  checkJWT,
  playlistController.getPlaylistVideos
);

///////////////////////// HỆ THỐNG /////////////////////////
router.post(
  "/checkAndCreatePlaylist",
  checkJWT,
  playlistController.checkAndCreatePlaylist
);

router.get("/getAutoPlaylist", checkJWT, playlistController.getAutoPlaylist);

router.get(
  "/getVideoInAutoPlaylist/:playlistId",
  checkJWT,
  playlistController.getVideoInAutoPlaylist
);
module.exports = router;
