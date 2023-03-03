import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const userRoutes = express.Router();

userRoutes.post("/register", async (req, res, next) => {
  try {
    const { body } = req;
    const previousUser = await User.findOne({ email: body.email });

    if (previousUser) {
      const error = new Error("the user is already registered!");
      return next(error);
    }
    const pwdHash = await bcrypt.hash(body.password, 10);
    //crear usuario en DB
    const newUser = new User({
      email: body.email,
      password: pwdHash,
    });
    const savedUser = await newUser.save();
    //respuesta
    return res.status(201).json({
      status: 201,
      message: "User registered successfully!",
      data: {
        id: savedUser._id,
      },
    });
  } catch (error) {
    return next(error);
  }
});

userRoutes.post("/login", async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);
    const user = await User.findOne({ email: body.email });
    const isValidPassword = await bcrypt.compare(
      body.password,
      user?.password ?? ""
    );
    if (!user || !isValidPassword) {
      const error = {
        status: 401,
        message: "The email & password combination is incorrect!",
      };
      return next(error);
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },

      req.app.get("secretKey"),
      { expiresIn: "1h" }
    );
    return res.json({
      status: 200,
      message: "loggin success!",
      data: {
        userId: user._id,
        token: token,
      },
    });
  } catch (error) {
    return next(error);
  }
});
userRoutes.post("/logout", async (req, res, next) => {
  try {
    req.authority = null;
    return res.json({
      status: 200,
      message: "logout success!",
      token: null,
    });
  } catch (error) {
    return next(error);
  }
});

export { userRoutes };
