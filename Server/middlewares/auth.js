// middlewares/auth.js
const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();

const verifyUser = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.json({ Error: "You are not authenticated" });
    jwt.verify(token, process.env.JWT_SECTRET_KEY, (err, decoded) => {
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
