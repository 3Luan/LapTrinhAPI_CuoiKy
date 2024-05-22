const express = require("express");
const postsController = require("../controllers/postsController");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage(); // You can change this to diskStorage if you want to save files to disk
const upload = multer({ storage: storage });

router.post(
  "/createPost",
  checkJWT,
  upload.fields([{ name: "images", maxCount: 10 }]),
  postsController.createPost
);
router.get("/getPosts/:currentPage", checkJWT, postsController.getPosts);

router.delete("/deletePosts", checkJWT, postsController.getPosts);

router.post("/likePost", checkJWT, postsController.likePost);

router.post("/unLikePost", checkJWT, postsController.unLikePost);

router.get(
  "/getPostsByUserId/:userId",
  checkJWT,
  postsController.getPostsByUserId
);

router.get("/getPostsById/:postId", checkJWT, postsController.getPostsById);

module.exports = router;
