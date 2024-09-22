const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");

const jwtSecretKey = "13711a765c2335db1eec7192d2c46060e9719304ff5075c194923f8b7cd18ccbe6db7e4818e10e6a6bfb36ac95994657cfbfa6be7bc5a179fad55bc17a21310e"


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
                    const token = jwt.sign({ firstName, role, id }, jwtSecretKey, { expiresIn: "5d" });
                    res.cookie('authToken', token, {
                        httpOnly: true,    // Ensures cookie is accessible only via HTTP (not JS)
                        secure: true,      // Ensures cookie is sent over HTTPS
                        sameSite: 'None',  // Allows cross-origin requests to include the cookie
                        maxAge: 24 * 60 * 60 * 1000  // Cookie expiry (1 day)
                    });
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
        res.clearCookie('authToken');
        return res.json({ Status: "Success" });
    }
}
module.exports = authController;