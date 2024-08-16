// controllers/UserController.js
const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const saltRounds = 10;

class UserController {

    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ message: "Server Error" });
        }
    }

    static async getAllInstructors(req, res) {
        try {
            const instructors = await UserModel.getAllInstructors();
            return res.json(instructors);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET Instructors with endpoint: /api/instructors" });
        }
    }

    static async getAllStudents(req, res) {
        try {
            const students = await UserModel.getAllStudents();
            return res.json(students);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET Students with endpoint: /api/students" });
        }
    }

    static async getUser(req, res) {
        const userID = req.params.id;
        try {
            const user = await UserModel.getUserById(userID);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ message: "Server Error" });
        }
    }

    static async updateUser(req, res) {
        const { password, userId } = req.body;
        const image = req.file;

        try {
            const updatePromises = [];

            if (password) {
                const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
                updatePromises.push(UserModel.updatePassword(userId, hashedPassword));
            }

            if (image) {
                const imageData = image.buffer;
                updatePromises.push(UserModel.updateImage(userId, imageData));
            }

            // Wait for all update queries to complete
            await Promise.all(updatePromises);

            // Send a success response
            res.json({ Status: "Success", Message: "User updated successfully" });

        } catch (error) {
            console.error("Error updating user profile:", error);
            res.status(500).json({ Status: "Error", Error: "Error updating user profile" });
        }
    }

    static async addAccount(req, res) {
        try {
            const { firstName, middleName, lastName, email, password, role, departmentName } = req.body;

            await UserModel.addAccount({ firstName, middleName, lastName, email, password, role, departmentName });

            return res.status(200).json({ Status: "Success" });
        } catch (error) {
            console.error("Error adding account:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

    static async updateAccount(req, res) {
        try {
            const { newFirstName, newMiddleName, newLastName, newEmail, newPassword, userID } = req.body;

            await UserModel.updateAccount({ newFirstName, newMiddleName, newLastName, newEmail, newPassword, userID });

            return res.status(200).json({ Status: "Success" });
        } catch (error) {
            console.error("Error updating account:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

    static async deleteAccount(req, res) {
        try {
            const { userID } = req.body;

            await UserModel.deleteAccount(userID);

            return res.status(200).json({ Status: "Success" });
        } catch (error) {
            console.error("Error deleting account:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }
}

module.exports = UserController;
