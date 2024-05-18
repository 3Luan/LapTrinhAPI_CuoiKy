const express = require("express");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

router.get(
  "/getPlaylistId/:accessToken",
  checkJWT,
  playlistController.getPlaylistId
);

module.exports = router;
