import type { Request, Response } from "express";
const prisma = require("../../configs/prisma/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

type paylaodType = {
  user_id: number;
  email: string;
  role: string;
};

exports.LoginController = async (req: Request, res: Response) => {
  try {
    type bodyType = {
      email: string;
      password: string;
    };

    const { email, password } = req.body as bodyType;

    //validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }

    //find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "invalid email and password" });
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "invalid email and password" });
    }

    const payload: paylaodType = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    //success - dont send password back
    return res.status(200).json({
      success: true,
      message: "login success",
      data: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("login faild", error);
    return res.status(500).json({ success: false, message: "server failed" });
  }
};
