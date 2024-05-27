const User = require('../Models/Login-Model')
const {google} = require("googleapis")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Signup = async(req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new User ({
            username: req.body.username,
            password: hash
        })
        await user.save()
        res.status(200).json({mes: 'User created'})
    } catch (error) {
        res.status(500).json({mes: error})
    }
}

const Login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})

        if(!user){
            return res.status(401).json({mesUser: 'Invalid Username'})
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match){
            return res.status(401).json({mesPass: 'Invalid Password'})
        }

        // const RefreshToken = jwt.sign({userId: user._id}, process.env.REFRESH_TOKEN, {expiresIn: "1h"})
        const token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN, { expiresIn: '2m' });
    
        res.cookie("tokeno", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 120000
        })
    
        // res.cookie("RefreshTokeno", RefreshToken, {
        //     httpOnly: true,
        //     secure: true,
        // sameSite: "None",
        //     maxAge: 3600000
        // })

        res.status(200).json({Mes: "Welcome Dear !"})

    } catch (error) {
        return res.status(500).json({error})
    }
}

const REDIRECT_URI = 'https://back-store-mkge.onrender.com/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    REDIRECT_URI
);

const initiateGoogleLogin = async (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        });
        res.json({ url });
    } catch (error) {
        console.error('Error generating Google OAuth URL:', error);
        res.status(500).json({ errorInit: error });
    }
}

const Google_cb = async (req, res) => {
    try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    console.log("From Data :", data)

    // Generate JWT
    const token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '2m' });
    const RefreshToken = jwt.sign(data, process.env.REFRESH_TOKEN, {expiresIn: "1h"})

    res.cookie("tokeno", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 120000
    })

    res.cookie("RefreshTokeno", RefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3600000
    })

    res.status(200).redirect("https://computers-store.netlify.app/store")
    } catch (error) {
        console.error('Error handling Google callback:', error);
        res.status(500).json({ errorCallb: error });
    }
}

const Welcome = async (req, res) => {
    try {
        res.status(200).json({Mes: "Welcome dear User !"})
    } catch (error) {
        res.status(500).json({Message: "Sorry, Something went wrong !!"})
    }
}

const RefreshEndPoint = async(req, res) => {
    try {
        const { RefreshTokeno } = req.cookies

    if(!RefreshTokeno) {
        return res.status(403).json({Refresh_Mes: "No Refresh Token found !"})
    } else {
        jwt.verify(RefreshTokeno, process.env.REFRESH_TOKEN, (err, user) => {
            if(err) {
                console.log("Token Verification", err)
            } else {

                const NewToken = jwt.sign({data: user}, process.env.ACCESS_TOKEN, {expiresIn: "2m"})

                res.cookie("tokeno", NewToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 120000
                })

                res.status(200).json({ message: "Access token refreshed" });
                
            }
        })
    }
    } catch (error) {
        res.status(500).json({Mes: error})
    }
}


// const LogOut = async (req, res) => {
//     try {
//         const revokedTokens = new Set;
//         const { tokeno, RefreshTokeno } = req.cookies;

//     revokedTokens.add(tokeno)
//     revokedTokens.add(RefreshTokeno)

//     res.clearCookie("tokeno")
//     res.clearCookie("RefreshTokeno")

//     res.status(200).json({ message: 'Logout successful' });
//     } catch (error) {
//         res.status(403).json({Mes: "No acess !"})
//     }

// }


module.exports = {Signup, Login, initiateGoogleLogin, Google_cb, Welcome, RefreshEndPoint}