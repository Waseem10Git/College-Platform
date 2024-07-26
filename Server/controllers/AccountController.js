// AccountController.js
const bcrypt = require('bcrypt');
const userModel = require('../models/User');
const saltRounds = 10; // Define your salt rounds

class AccountController {
    static async addAccount(req, res) {
        const { firstName, middleName, lastName, email, password, role, departmentName } = req.body;
        try {
            const hash = await bcrypt.hash(password.toString(), saltRounds);
            const result = await userModel.addUser(firstName, middleName, lastName, email, hash, role, departmentName);
            res.json({ Status: 'Success' });
        } catch (error) {
            console.error("Error inserting data:", error);
            res.json({ Status: 'Error', Error: 'Error inserting data' });
        }
    }

    static async updateAccount(req, res) {
        const { newFirstName, newMiddleName, newLastName, newEmail, newPassword, userID } = req.body;
        try {
            const fields = [];
            const values = [];

            if (newFirstName) {
                fields.push('first_name = ?');
                values.push(newFirstName);
            }
            if (newMiddleName) {
                fields.push('middle_name = ?');
                values.push(newMiddleName);
            }
            if (newLastName) {
                fields.push('last_name = ?');
                values.push(newLastName);
            }
            if (newEmail) {
                fields.push('email = ?');
                values.push(newEmail);
            }
            if (newPassword) {
                const hash = await bcrypt.hash(newPassword.toString(), saltRounds);
                fields.push('password = ?');
                values.push(hash);
            }

            values.push(userID);
            const result = await userModel.updateUser(fields, values);
            res.json({ Status: 'Success' });
        } catch (error) {
            console.error("Error updating data:", error);
            res.json({ Status: 'Error', Error: 'Error updating data' });
        }
    }

    static async deleteAccount(req, res) {
        const { userID } = req.body;
        try {
            const result = await userModel.deleteUser(userID);
            res.json({ Status: 'Success' });
        } catch (error) {
            console.error("Error deleting data:", error);
            res.json({ Error: 'Deleting data Error in server' });
        }
    }
}

module.exports = AccountController;
