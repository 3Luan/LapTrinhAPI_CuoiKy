const express = require("express");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();
const likeVideoController = require("../controllers/likeVideoController");

router.get("/getLikedVideos", checkJWT, likeVideoController.getLikedVideos);

router.post("/likeVideo", checkJWT, likeVideoController.likeVideo);

router.post("/unlikeVideo", checkJWT, likeVideoController.unlikeVideo);

router.post("/checkLikeVideo", checkJWT, likeVideoController.checkLikeVideo);

router.post("/addComment", checkJWT, likeVideoController.addComment);

router.post("/deleteComment", checkJWT, likeVideoController.deleteComment);

module.exports = router;
