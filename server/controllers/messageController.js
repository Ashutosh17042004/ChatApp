import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// get all user expect the logged in user
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user_Id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    ); //here $ne=(not equal to)

    // count no. of mesg not seen
    const unseenMessages = {};
    const promises = filteredUser.map(async (user) => {
      const messages = await Message.find({
        sendenId: user._id,
        recieverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUser, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const myId = req.user._id.toString();

    // Convert selected USER ID
    // const selectedUserId = mongoose.Types.ObjectId(selectedUserIdStr);

    console.log({ myId, selectedUserId });

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          recieverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          recieverId: myId,
        },
      ],
    }).sort({ createdAt: 1 }); //oldest first
    // console.log(messages, "line52 msgconn");

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);

    res.json({ success: false, message: error.message });
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[recieverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
