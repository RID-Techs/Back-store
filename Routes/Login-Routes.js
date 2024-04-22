const express = require('express')
const Auth = require('../Middlewares/Auth')
const { Signup, Login } = require('../Controllers/Login-Controller')
const router = express.Router()

router.post("/signup", Signup)
router.post("/login", Login)

module.exports = router