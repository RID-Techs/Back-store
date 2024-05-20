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

const Login = async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})

        if(!user){
            return res.status(401).json({mesUser: 'Invalid Username'})
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match){
            return res.status(401).json({mesPass: 'Invalid Password'})
        }

        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                process.env.ACCESS_TOKEN,
                {expiresIn: "1800s"}
            )
        })
    } catch (error) {
        return res.status(500).json({error})
    }
}

const REDIRECT_URI = 'http://localhost:9009/auth/google/callback';

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
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const Google_cb = async (req, res) => {
    try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    console.log(data)

    // Generate JWT
    const token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
    res.cookie("tokeno", token, {
        httpOnly: true,
        secure: false,
        maxAge: 360000
    })
    res.status(200).redirect("http://localhost:5173/store")
    } catch (error) {
        console.error('Error handling Google callback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {Signup, Login, initiateGoogleLogin, Google_cb}