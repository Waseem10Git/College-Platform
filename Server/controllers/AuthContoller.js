const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require("../models/User");

const jwtSecretKey = "13711a765c2335db1eec7192d2c46060e9719304ff5075c194923f8b7cd18ccbe6db7e4818e10e6a6bfb36ac95994657cfbfa6be7bc5a179fad55bc17a21310e"


class authController {
    static async authorization(req, res) {
        const { firstName, role, id } = req.user;
        return res.json({ Status: "Success", firstName, role, id });
    }

    static async signIn(req, res) {
        const { email, password } = req.body;
        try {
            const users = await userModel.getUserByEmail(email);
            if (users.length > 0) {
                const user = users[0];
                const isMatch = await bcrypt.compare(password.toString(), user.password);
                if (isMatch) {
                    const { first_name: firstName, role, id } = user;
                    const token = jwt.sign({ firstName, role, id }, jwtSecretKey, { expiresIn: '5d' });
                    res.cookie('token', token);
                    return res.json({ Status: 'Success' });
                } else {
                    return res.json({ Error: 'Password not matched' });
                }
            } else {
                return res.json({ Error: 'No email existed' });
            }
        } catch (error) {
            return res.json({ Error: 'Login error' });
        }
    }

    static async signOut(req, res) {
        res.clearCookie('token');
        return res.json({ Status: "Success" });
    }
}
module.exports = authController;