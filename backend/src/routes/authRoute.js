const express = require("express");
const authController = require("../controllers/authController");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();

router.post("/refresh", checkJWT, authController.refresh);
router.post("/logout", authController.logout);

router.get("/google", authController.loginWithGoogle);
router.get("/google/callback", authController.loginWithGoogleCallback);

module.exports = router;
