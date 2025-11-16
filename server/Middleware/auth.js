import jwt from "jsonwebtoken";
import User from "../models/User";

// middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password"); //here ".select("-password");" fetch every data of user accept password and by seperating user id from payload "(decoded.userId)" it matches is user exist in database or not.

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    req.user = user; //attacting user object to req for further routes(controller function) to access it from "req"
    next();
  } catch (error) {
    console.log(error.message);

    res.json({ success: false, message: error.message });
  }
};
