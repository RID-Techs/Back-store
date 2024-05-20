const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const token = req.cookies.tokeno; 
    
    if (!token) {
        
        return res.redirect('/login');
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ message: "Not authenticated!" });
            } else {
                console.log('Authenticated user:', user);
                next();
            }
        });
    }
};

module.exports = checkAuth;

