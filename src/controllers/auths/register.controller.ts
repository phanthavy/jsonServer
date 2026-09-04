import type { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../configs/prisma/prisma");

type PayloadType = {
  user_id: number;
  email: string;
  role: string;
};

type bodyType = {
  email: string;
  password: string;
  name: string;
};

exports.RegisterController = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as bodyType;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "email, password, name are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "this account already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    const payload: PayloadType = {
      user_id: newUser.user_id,
      email: newUser.email,
      role: newUser.role,
    };

    jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "register success",
      data: newUser,
    });
  } catch (error) {
    console.log("register failed", error);
    return res.status(500).json({ success: false, message: "server failed" });
  }
};
