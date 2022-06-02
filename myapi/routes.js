const express = require("express");
const router = express.Router();
const mainController = require("./controllers/main")

router.get("/hello", mainController.index);
router.post("/upload", mainController.upload);

module.exports = router;