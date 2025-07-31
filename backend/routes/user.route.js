import express from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";
const userRouter = express.Router();

userRouter.post("/register",upload.single('avatar'), registerUser);
userRouter.post('/login',login)
userRouter.post('/logout',logout)

export default userRouter;
