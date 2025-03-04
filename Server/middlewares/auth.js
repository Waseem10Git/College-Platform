const jwt = require('jsonwebtoken');
const env = require('dotenv');
const UserModel = require('../models/User');

env.config();

const verifyUser = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ Error: "You are not authenticated" });
    jwt.verify(token, process.env.JWT_SECTRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Token is not valid" });
        } else {
            req.user = decoded;
            next();
        }
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ EnMessage: 'Access denied', ArMessage: 'تم الرفض' });
    }
    next();
};

const verifyToken = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ EnMessage: "Unauthorized", ArMessage: 'غير مرخص' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECTRET_KEY);

        // Check if the token matches the one in the database
        const [rows] = await UserModel.getSessionToken(decoded.id);

        if (rows.length === 0 || rows.session_token !== token) {
            return res.status(401).json({ EnMessage: "Session expired, please log in again", ArMessage: 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({ EnMessage: "Invalid token", ArMessage: 'الرمز غير صالح' });
    }
};


module.exports = {
    verifyUser,
    isAdmin,
    verifyToken
};
