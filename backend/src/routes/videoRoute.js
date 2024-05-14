const express = require("express");
const videoController = require("../controllers/videoController");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();

// router.get("/getVideo", videoController.getVideo);

module.exports = router;
