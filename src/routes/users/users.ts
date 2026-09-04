const express = require("express");
const usersRouter = express.Router();
const { getUsers } = require("../../controllers/users/users.controller");

usersRouter.get("/users", getUsers);

module.exports = usersRouter;
