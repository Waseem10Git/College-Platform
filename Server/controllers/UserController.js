const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserController {
    static async getAllUsers(req, res) {
        try {
            const result = await userModel.getUsers();
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: 'No users found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }

    static async getUser(req, res) {
        const userID = req.params.id;
        try {
            const result = await userModel.getUserById(userID);
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }

    static async updateUser(req, res) {
        const { password, userId } = req.body;
        const image = req.file;

        try {
            const updatePromises = [];

            if (password) {
                const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
                updatePromises.push(userModel.updatePassword(userId, hashedPassword));
            }

            if (image) {
                const imageData = image.buffer;
                updatePromises.push(userModel.updateImage(userId, imageData));
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
}

module.exports = UserController;
