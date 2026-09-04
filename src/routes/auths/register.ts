const express = require('express')
const loginRouter = express.Router()
const { RegisterController } = require('../../controllers/auths//register.controller')

loginRouter.post('/register', RegisterController)

module.exports = loginRouter