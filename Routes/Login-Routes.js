const express = require('express')
const Auth = require('../Middlewares/Auth')
const { Signup, Login, initiateGoogleLogin, Google_cb, Welcome, RefreshEndPoint, LogOut } = require('../Controllers/Login-Controller')
const checkAuth = require('../Middlewares/cookieAuth')
const checkTokenAuth = require('../Middlewares/checkToken')
const router = express.Router()

router.post("/signup", Signup)
router.post("/login", Login)
router.get("/google", initiateGoogleLogin)
router.get("/google/callback", Google_cb)
router.get("/welcome", checkAuth, checkTokenAuth, Welcome)
router.post("/refreshtoken", RefreshEndPoint)
router.post("/logout", checkAuth, LogOut)

module.exports = router