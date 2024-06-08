const express = require("express");
const postsController = require("../controllers/postsController");
const { checkJWT, checkAdminJWT } = require("../middleware/jwtActions");
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

router.post(
  "/updatePost",
  checkJWT,
  upload.fields([{ name: "images", maxCount: 10 }]),
  postsController.updatePost
);

router.post("/deletePost", checkJWT, postsController.deletePost);

router.get("/getPosts/:currentPage", checkJWT, postsController.getPosts);

router.delete("/deletePosts", checkJWT, postsController.getPosts);

router.post("/likePost", checkJWT, postsController.likePost);

router.post("/unLikePost", checkJWT, postsController.unLikePost);

router.get(
  "/getPostsByUserId/:userId/:currentPage",
  checkJWT,
  postsController.getPostsByUserId
);

router.get("/getPostsById/:postId", checkJWT, postsController.getPostsById);

router.get("/count/:userId",checkJWT, postsController.countUserPosts);

// Admin
router.get(
  "/getDeletePosts/:currentPage",
  checkAdminJWT,
  postsController.getDeletePosts
);

// router.get(
//   "/getPostsStatistics/:day/:month/:year",
//   checkAdminJWT,
//   postController.getPostsStatistics
// );

// router.get(
//   "/getUnapprovedPostsStatistics/:day/:month/:year",
//   checkAdminJWT,
//   postController.getUnapprovedPostsStatistics
// );

// router.get(
//   "/getapprovedPostsStatistics/:day/:month/:year",
//   checkAdminJWT,
//   postController.getapprovedPostsStatistics
// );

// router.get(
//   "/getPostDeleteDetailById/:postId",
//   checkAdminJWT,
//   postController.getPostDeleteDetailById
// );

module.exports = router;
