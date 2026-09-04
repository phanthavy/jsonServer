const prisma = require("../../configs/prisma/prisma");
import { type Request, type Response } from "express";

exports.getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    return res
      .status(200)
      .json({
        success: true,
        message: "retrived users successfully",
        data: users,
      });
  } catch (error) {
    console.log("failed to fetch users", error);
    return res.status(500).json({ success: false, message: "server failed" });
  }
};
