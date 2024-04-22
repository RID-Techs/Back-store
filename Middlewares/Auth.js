const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if(!authHeader){
            return res.status(401).json({Mes: "Authorization header is missing"})
        }

        const token = authHeader.split(' ')[1]
        if(!token){
            return res.status(401).json({Mes: "Token is missing"})
        }

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if(err){
                console.error('Token verification failed:', err);
                return res.status(401).json({ message: "Token verification failed" });
            } else {
                req.user = user
                console.log('User authenticated:', user);
                next()
            }
        })
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = auth