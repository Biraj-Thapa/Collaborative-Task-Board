import express from "express";
import { login, logout, registerUser,getCurrentUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/register",upload.single('avatar'), registerUser);
userRouter.post('/login',login)
userRouter.post('/logout',logout)
userRouter.get('/me',isAuthenticated ,getCurrentUser)

export default userRouter;
