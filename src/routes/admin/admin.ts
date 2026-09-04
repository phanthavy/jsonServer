const express = require("express");
const usersRouter = express.Router();
const { getUsers } = require("../../controllers/users/users.controller");
const { authMiddleWare } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/role.middleware");

usersRouter.get("/admin", authMiddleWare, requireRole("admin"), getUsers);

module.exports = usersRouter;
