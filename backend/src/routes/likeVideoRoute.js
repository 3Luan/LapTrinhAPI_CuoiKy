const express = require("express");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();
const likeVideoController = require("../controllers/likeVideoController");

router.get("/getLikedVideos", checkJWT, likeVideoController.getLikedVideos);

module.exports = router;
