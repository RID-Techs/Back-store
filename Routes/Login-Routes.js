const express = require('express')
const Auth = require('../Middlewares/Auth')
const { Signup, Login } = require('../Controllers/Login-Controller')
const checkAuth = require('../Middlewares/cookieAuth')
const checkTokenAuth = require('../Middlewares/checkToken')
const router = express.Router()

router.post("/signup", Signup) 
router.post("/login", Login)
// router.get("/google", initiateGoogleLogin)
// router.get("/google/callback", Google_cb)
// router.get("/welcome", checkAuth, Welcome)
// router.post("/refreshtoken", RefreshEndPoint)
// router.post("/logout", checkAuth, LogOut)

module.exports = router