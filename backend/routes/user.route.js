import express from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post('/login',login)
userRouter.post('/logout',logout)

export default userRouter;
