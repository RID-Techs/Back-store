const express = require('express')
const Auth = require('../Middlewares/Auth')
const { Signup, Login, initiateGoogleLogin, Google_cb } = require('../Controllers/Login-Controller')
const router = express.Router()

router.post("/signup", Signup)
router.post("/login", Login)
router.get("/google", initiateGoogleLogin)
router.get("/google/callback", Google_cb)

module.exports = router