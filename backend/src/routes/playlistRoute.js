const express = require("express");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

router.get("/createPlaylist", checkJWT, playlistController.CreatePlaylist);

module.exports = router;
