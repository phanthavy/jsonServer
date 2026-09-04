const express = require("express");
const loginRouter = express.Router();
const { LoginController } = require("../../controllers/auths/login.controller");

loginRouter.post("/login", LoginController);

module.exports = loginRouter;
