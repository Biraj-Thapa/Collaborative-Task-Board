import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
const saltRounds = 10;

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let existUser = await User.findOne({ email: email });
    if (existUser) {
     return res.status(400).json({ message: "User already exist" });
    }
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      fullName,
      email,
      password: encryptedPassword,
    });
    let token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({ user: { fullName, email } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "User doesnot exist" });
    }
    let match = await bcrypt.compare(password, existUser.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let token = generateToken(existUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "login success",
      firstName: existUser.firstName,
      email: existUser.email,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json("Logout success")
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
};
