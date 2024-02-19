const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//endpoint for fetching all the message for the particular chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })    //why using req.params, because it is inside as a parameter
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


//requirements for sending message:
//1. first will be chat id on which chat we are supposed to send the message ... from the body itself
//2. the actual message content .. from the body itself
//3. who is the snder of the message.. we will get the sender of the message from our middleware(protect) i.e., the looged in user right!
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  //otherwise will create the new message
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    //to update the message by the latest message
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json({
      ...message.toJSON(),
      createdAt: new Date(message.createdAt).toLocaleString(),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
