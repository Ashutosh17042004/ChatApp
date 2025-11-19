import Message from "../models/message.js";
import User from "../models/User.js";

// get all user expect the logged in user
export const getUserForSidevbar = async (req, res) => {
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
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          receiverId: myId,
        },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );
    res.json({success:true,messages})
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
