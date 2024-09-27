const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");
const env = require('dotenv')

env.config();

class authController {
    static async getUserInfo(req, res) {
        const { firstName, role, id } = req.user;
        return res.json({ Status: "Success", firstName, role, id });
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
                    res.cookie('authToken', token);
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            } else {
                return res.json({ Error: "No email existed" });
            }
        } catch (err) {
            return res.json({ Error: "Login error" });
        }
    }

    static async signOut(req, res) {
        res.clearCookie('authToken', {
            httpOnly: true,
                secure: true,
                sameSite: 'None'
        });
        return res.json({ Status: "Success" });
    }
}
module.exports = authController;