const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const DepartmentModel = require('../models/Department');
const XLSX = require('xlsx');
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

    static async getLastUserId(req, res) {
        try {
            const lastUserId = await UserModel.getLastUserId();

            // Check if the result is empty
            if (!lastUserId || lastUserId.length === 0) {
                return res.status(404).json({ message: "User not found (last user id)" });
            }

            // Send the first result (the latest user ID)
            return res.json(lastUserId[0]); // Assuming you want the ID object
        } catch (err) {
            return res.status(500).json({
                message: "Server Error in GET Students with endpoint: /api/user/lastUserId"
            });
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

            // if (image) {
            //     const imageData = image.buffer;
            //     updatePromises.push(UserModel.updateImage(userId, imageData));
            // }

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
            const { userID, firstName, lastName, email, password, role, departmentID } = req.body;

            if (userID.toString().length < 7 || !userID)
                return res.status(400).json({success: false, message: 'userId empty or less than 7 digit'});

            const userIDExist = await UserModel.getUserById(userID);

            if (userIDExist) return res.status(404).json({ status: "Error", message: "User ID is exist" });

            const userEmailExist = await UserModel.getUserByEmail(email);

            if (userEmailExist.length > 0) return res.status(404).json({ status: "Error", message: "User Email is exist" });

            await UserModel.addAccount({ userID, firstName, lastName, email, password, role, departmentID });

            return res.status(200).json({ status: "Success" });
        } catch (error) {
            console.error("Error adding account:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

    static async updateAccount(req, res) {
        try {
            const { newFirstName, newLastName, newEmail, newPassword, newRole, newDepartmentID, userID } = req.body;

            const userExist = await UserModel.getUserById(userID);

            if (!userExist) return res.status(404).json({ Status: "Error", Message: "User not exist" });

            await UserModel.updateAccount({ newFirstName, newLastName, newEmail, newPassword, newRole, newDepartmentID, userID });

            return res.status(200).json({ Status: "Success" });
        } catch (error) {
            console.error("Error updating account:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

    static async deleteAccount(req, res) {
        try {
            const { id } = req.params;
            console.log("id", id);
            const userExist = await UserModel.getUserById(id);

            if (!userExist) return res.status(404).json({ Status: "Error", Message: "User not exist" });

            await UserModel.deleteAccount(id);

            return res.status(200).json({ Status: "Success", Message: "User account deleted successfully" });
        } catch (error) {
            console.error("Error deleting account:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

    static async uploadAccounts(req, res) {
        try {
            console.log('file: ', req.file);
            const filePath = req.file.path;
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const allData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const header = allData[0]; // First row as headers
            const data = allData.slice(1);
            console.log('header: ', header);

            const departments = await DepartmentModel.getAllDepartments();
            const validDepartmentIDs = departments.map(dept => dept.department_id);

            const errors = [];

            for (let i = 0; i < data.length; i++) {
                const account = data[i];
                const rowNumber = i + 2;

                const userID = account[0];
                const firstName = account[1];
                const lastName = account[2];
                const email = account[3];
                const password = account[4];
                const role = account[5];
                const departmentID = account[6];

                const validationErrors = [];

                if (!userID || userID.toString().length < 7) validationErrors.push("UserID is missing or less than 7 digit");
                if (!firstName) validationErrors.push("FirstName is missing");
                if (!lastName || !/^[a-zA-Z]*$/.test(lastName)) validationErrors.push("LastName is missing");
                if (!email || !/^[\w.-]+@fcai\.usc\.edu\.eg$/.test(email)) validationErrors.push("Invalid email or domain. Email must end with '@fcai.ucs.edu.eg'");
                if (!password) validationErrors.push("Password is missing");
                if (!role) validationErrors.push("Role is missing");
                if (departmentID && !validDepartmentIDs.includes(departmentID)) {
                    validationErrors.push(`Invalid departmentID. It must be one of: ${validDepartmentIDs.join(', ')}`);
                }

                const userIDExistence = await UserModel.getUserById(userID);
                if (userIDExistence) validationErrors.push(`User id (${userID}) is exist before`);

                const userEmailExistence = await UserModel.getUserByEmail(email);
                if (userEmailExistence.length > 0) validationErrors.push(`User email (${email}) is exist before`);

                if (validationErrors.length > 0) {
                    errors.push({ row: rowNumber, errors: validationErrors });
                    continue;
                }

                try {
                    await UserModel.addAccount({
                        userID,
                        firstName,
                        lastName,
                        email,
                        password,
                        role,
                        departmentID
                    });
                } catch (dbError) {
                    errors.push({ row: rowNumber, errors: [`Database error: ${dbError.message}`] });
                }
            }

            if (errors.length > 0) {
                return res.status(200).json({
                    Status: "Partial Success",
                    Message: "Some rows failed to process.",
                    Errors: errors
                });
            }

            return res.status(200).json({ Status: "Success", Message: "All rows processed successfully." });
        } catch (error) {
            console.error("Error uploading accounts:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

}

module.exports = UserController;
