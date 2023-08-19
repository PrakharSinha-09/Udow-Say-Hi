const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);                 //fetching all the message of one single chat
router.route("/").post(protect, sendMessage);                       //user must be of course logged in thus protect middleware is used

module.exports = router;
