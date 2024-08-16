// middlewares/auth.js
const jwt = require('jsonwebtoken');
const jwtSecretKey = "13711a765c2335db1eec7192d2c46060e9719304ff5075c194923f8b7cd18ccbe6db7e4818e10e6a6bfb36ac95994657cfbfa6be7bc5a179fad55bc17a21310e";

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.json({ Error: "You are not authenticated" });
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.json({ Error: "Token is not valid" });
        } else {
            req.user = decoded;
            next();
        }
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = {
    verifyUser,
    isAdmin
};
