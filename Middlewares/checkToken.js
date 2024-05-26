
// const { revokedTokens } = require("../Controllers/Login-Controller")

// const checkToken = (req, res, next) => {

//     const { accessToken } = req.cookies;

//     if (revokedTokens.has(accessToken)) {
//         return res.status(401).json({ message: 'Token revoked. Please log in again' });
//     }

//     next();
// };

// module.exports = checkToken;