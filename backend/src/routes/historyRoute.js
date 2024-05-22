const express = require("express");
const historyController = require("../controllers/historyController");
const { checkJWT } = require("../middleware/jwtActions");
const router = express.Router();

router.post("/addHistory", checkJWT, historyController.addHistory);
router.get("/getHistory", checkJWT, historyController.getHistory);

module.exports = router;
