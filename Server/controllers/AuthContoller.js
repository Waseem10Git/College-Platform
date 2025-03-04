const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");
const env = require('dotenv')

env.config();

class authController {
    static async getUserInfo(req, res) {
        const { firstName, role, id } = req.user;
        return res.status(200).json({ Status: "Success", firstName, role, id });
    }

    static async signIn(req, res) {
        const { email, password } = req.body;

        try {
            const results = await UserModel.getUserByEmail(email);

            if (!results) {
                return res.status(404).json({ message: "User not found" });
            }

            if (results.length > 0) {
                const match = await bcrypt.compare(password.toString(), results[0].password);
                if (match) {
                    const { first_name: firstName, role, id } = results[0];

                    const token = jwt.sign({ firstName, role, id }, process.env.JWT_SECTRET_KEY, { expiresIn: "1d" });

                    await UserModel.updateSessionToken(token, email);

                    res.cookie('authToken', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'Strict',
                        maxAge: 24 * 60 * 60 * 1000
                    });

                    return res.status(200).json({ Status: "Success" });
                } else {
                    return res.status(401).json({ Error: "Invalid email or password" });
                }
            } else {
                return res.status(401).json({ Error: "Invalid email or password" });
            }
        } catch (err) {
            return res.status(500).json({ Error: "Internal server error" });
        }
    }

    static async signOut(req, res) {
        const token = req.cookies.authToken;
        if (!token) return res.status(400).json({ message: "No token provided" });

        try {
            await UserModel.deleteSessionToken(token);
            res.clearCookie('authToken');

            return res.status(200).json({ Status: "Success" });
        } catch (err) {
            return res.status(500).json({ Error: "Internal server error" });
        }
    }

    // OLD ---------
    // static async signIn(req, res) {
    //     const { email, password } = req.body;
    //
    //     try {
    //         const results = await UserModel.getUserByEmail(email);
    //
    //         if (!results) {
    //             return res.status(404).json({ message: "User not found" });
    //         }
    //
    //         if (results.length > 0) {
    //             const match = await bcrypt.compare(password.toString(), results[0].password);
    //             if (match) {
    //                 const { first_name: firstName, role, id } = results[0];
    //                 const token = jwt.sign({ firstName, role, id }, process.env.JWT_SECTRET_KEY, { expiresIn: "5d" });
    //                 res.cookie('authToken', token, {
    //                     httpOnly: true,
    //                     secure: true,
    //                     sameSite: 'None'
    //                 });
    //
    //                 // Generate a new session token
    //                 const sessionToken = crypto.randomBytes(32).toString("hex");
    //
    //                 await UserModel.updateSessionToken(sessionToken, email);
    //
    //                 return res.status(200).json({ Status: "Success" });
    //             } else {
    //                 return res.status(401).json({ Error: "Invalid email or password" });
    //             }
    //         } else {
    //             return res.status(401).json({ Error: "Invalid email or password" });
    //         }
    //     } catch (err) {
    //         return res.status(500).json({ Error: "Internal server error" });
    //     }
    // }

    // static async signOut(req, res) {
    //     try {
    //         const id = req.body.userId;
    //
    //         res.clearCookie('authToken', {
    //             httpOnly: true,
    //             secure: true,
    //             sameSite: 'None'
    //         });
    //
    //         return res.status(200).json({ Status: "Success" });
    //     } catch (err) {
    //         return res.status(500).json({ Error: "Internal server error" });
    //     }
    // }
}
module.exports = authController;