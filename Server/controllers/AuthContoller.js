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
            if (results.length > 0) {
                const match = await bcrypt.compare(password.toString(), results[0].password);
                if (match) {
                    const { first_name: firstName, role, id } = results[0];
                    const token = jwt.sign({ firstName, role, id }, process.env.JWT_SECTRET_KEY, { expiresIn: "5d" });
                    res.cookie('authToken', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None'
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
        res.clearCookie('authToken', {
            httpOnly: true,
                secure: true,
                sameSite: 'None'
        });
        return res.status(200).json({ Status: "Success" });
    }
}
module.exports = authController;