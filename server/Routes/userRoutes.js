import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/userControllers.js";
import { protectRoute } from "../Middleware/auth.js";
const userRouter = express.Router();

// Api end point for all user controllers
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/Update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
