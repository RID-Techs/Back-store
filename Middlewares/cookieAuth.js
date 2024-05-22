const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const token = req.cookies.tokeno; 
    
    if (!token) {
        return res.status(401).json({ NoTokenMes: "Not authenticated, No Token !" });
    } else {
        console.log("The token is", token)

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ AuthMes: "No new Acess Token !" });
            } else {
                console.log('Authenticated user:', user);
                req.user = user
                next();
            }
        });
    }
};

module.exports = checkAuth;

