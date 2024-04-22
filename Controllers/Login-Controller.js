const User = require('../Models/Login-Model')
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

module.exports = {Signup, Login}