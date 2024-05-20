const express = require("express");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

router.get("/getPlaylistId", checkJWT, playlistController.getPlaylistId);

router.get(
  "/getPlaylistVideos/:playlistId",
  checkJWT,
  playlistController.getPlaylistVideos
);

module.exports = router;
