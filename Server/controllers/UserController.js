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
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async getAllStudents(req, res) {
        try {
            const students = await UserModel.getAllStudents();
            return res.json(students);
        } catch (err) {
            return res.status(500).json({ success: false, EnMessage: 'Sever Error', ArMessage: 'خطأ في الخادم' });
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

    static async editPassword(req, res) {
        const { oldPassword, newPassword, userId } = req.body;
        try {
            if (!oldPassword || !newPassword || !userId) {
                return res.status(400).json({ success: false, EnMessage: "There is missing data", ArMessage: "هناك بيانات مفقودة" });
            }

            const oPassword = await UserModel.getOldPassword(userId);

            if (!oPassword || oPassword.length === 0) {
                return res.status(404).json({ success: false, EnMessage: "User not found", ArMessage: "المستخدم غير موجود" });
            }

            const isMatch = await bcrypt.compare(oldPassword.toString(), oPassword[0].password);
            if (!isMatch) {
                return res.status(400).json({ success: false, EnMessage: "Old password is incorrect", ArMessage: "كلمة المرور القديمة غير صحيحة" });
            }

            const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

            await UserModel.editPassword(userId, hashedPassword);
            return res.json({ success: true, EnMessage: "User password updated successfully", ArMessage: "تم تحديث كلمة مرور المستخدم بنجاح" });

        } catch (error) {
            console.error("Error updating user password:", error);
            return res.status(500).json({ success: false, EnMessage: "Error updating user password", ArMessage: "خطأ في تحديث كلمة مرور المستخدم" });
        }
    }


    static async addAccount(req, res) {
        try {
            const { userID, firstName, lastName, email, password, role, departmentID } = req.body;

            if (userID.toString().length < 7 || !userID)
                return res.status(400).json({success: false, EnMessage: 'User ID empty or less than 7 digit', ArMessage: 'لا يجب أن يكون الرقم التعريفي فارغ أو أقل من 7 أرقام'});

            const userIDExist = await UserModel.getUserById(userID);

            if (userIDExist) return res.status(404).json({ success: false, EnMessage: "User ID is exist", ArMessage: 'الرقم التعريفي موجود' });

            const userEmailExist = await UserModel.getUserByEmail(email);

            if (userEmailExist.length > 0) return res.status(404).json({ success: false, EnMessage: "User Email is exist", ArMessage: 'الإيميل موجود' });

            await UserModel.addAccount({ userID, firstName, lastName, email, password, role, departmentID });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error adding account:", error);
            return res.status(500).json({ success: false, EnMessage: 'Something went wrong, Please try again later', ArMessage: 'حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا' });
        }
    }

    static async updateAccount(req, res) {
        try {
            const { newFirstName, newLastName, newEmail, newPassword, newRole, newDepartmentID, userID, newUserID } = req.body;

            const userExist = await UserModel.getUserById(userID);

            if (!userExist) return res.status(404).json({ success: false, EnMessage: "User not exist", ArMessage: "المستخدم غير موجود" });

            const newUserIDExist = await UserModel.getUserById(newUserID);

            if (newUserIDExist) return res.status(404).json({ success: false, EnMessage: "User ID is exist", ArMessage: "الرقم التعريفي للمستخدم موجود بالفعل"})

            await UserModel.updateAccount({ newFirstName, newLastName, newEmail, newPassword, newRole, newDepartmentID, userID, newUserID });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error updating account:", error);
            return res.status(500).json({ success: false, EnMessage: 'Something went wrong, Please try again later', ArMessage: 'حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا' });
        }
    }

    static async deleteAccount(req, res) {
        try {
            const { id } = req.params;

            const userExist = await UserModel.getUserById(id);

            if (!userExist) return res.status(404).json({ success: false, EnMessage: "User not exist", ArMessage: 'المستخدم غير موجود' });

            await UserModel.deleteAccount(id);

            return res.status(200).json({ success: true, EnMessage: "User account deleted successfully", ArMessage: 'تم حذف حساب المستخدم بنجاح' });
        } catch (error) {
            console.error("Error deleting account:", error);
            return res.status(500).json({ success: false, EnMessage: 'Something went wrong, Please try again later', ArMessage: 'حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا' });
        }
    }

    static async uploadAccounts(req, res) {
        try {
            if (!req.file || !req.file.mimetype.includes("spreadsheetml")) {
                return res.status(400).json({
                    Status: "Error",
                    EnMessage: "Invalid file format. Please upload an Excel file.",
                    ArMessage: "تنسيق الملف غير صالح. يرجى تحميل ملف Excel."
                });
            }

            console.log('file: ', req.file);
            const filePath = req.file.path;
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const allData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const header = allData[0]; // First row as headers
            const data = allData.slice(1);
            console.log('header: ', header);

            const requiredHeaders = [
                "userID",
                "firstName",
                "lastName",
                "email",
                "password",
                "role",
                "departmentID"
            ];

            const isValidTemplate = (uploadedHeaders) => {
                return JSON.stringify(requiredHeaders) === JSON.stringify(uploadedHeaders);
            };

            if (!isValidTemplate(header)) {
                return res.status(400).json({
                    Status: "Error",
                    EnMessage: "Uploaded file does not match the required template.",
                    ArMessage: "الملف المرفوع لا يتطابق مع القالب المطلوب.",
                    Errors: { Header: header, ExpectedHeader: requiredHeaders }
                });
            }

            const departments = await DepartmentModel.getAllDepartments();
            const validDepartmentIDs = new Set(departments.map(dept => dept.department_id));

            const errors = [];
            const validatedRows = [];

            for (let index = 0; index < data.length; index++) {
                const rowNumber = index + 2;

                const [
                    userID,
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    departmentID
                ] = data[index];

                const EnValidationErrors = [];
                const ArValidationErrors = [];

                // Validation rules
                if (!userID || userID.toString().length < 7) {
                    EnValidationErrors.push("UserID is missing or less than 7 digits");
                    ArValidationErrors.push("الرقم التعريفي ليس موجود أو أقل من 7 أرقام");
                }
                if (!firstName) {
                    EnValidationErrors.push("FirstName is missing");
                    ArValidationErrors.push("الاسم الأول غير موجود");
                }
                if (!lastName || !/^[a-zA-Z]*$/.test(lastName)) {
                    EnValidationErrors.push("LastName is missing or invalid");
                    ArValidationErrors.push("الاسم الأخير غير موجود أو غير صالح");
                }
                if (!email || !/^[\w.-]+@fcai\.usc\.edu\.eg$/.test(email)) {
                    EnValidationErrors.push("Invalid email or domain. Must end with '@fcai.usc.edu.eg'");
                    ArValidationErrors.push("البريد الإلكتروني غير صحيح. يجب أن ينتهي بـ '@fcai.usc.edu.eg'");
                }
                if (!password) {
                    EnValidationErrors.push("Password is missing");
                    ArValidationErrors.push("كلمة السر غير موجودة");
                }
                if (!role) {
                    EnValidationErrors.push("Role is missing");
                    ArValidationErrors.push("الدور غير موجود");
                }
                if (departmentID && !validDepartmentIDs.has(departmentID)) {
                    EnValidationErrors.push(`Invalid departmentID. It must be one of: ${[...validDepartmentIDs].join(', ')}`);
                    ArValidationErrors.push(`رقم القسم غير صحيح. يجب أن يكون واحد من ${[...validDepartmentIDs].join(', ')}`);
                }

                // Check database existence
                const userIDExistence = await UserModel.getUserById(userID);
                if (userIDExistence) {
                    EnValidationErrors.push(`UserID (${userID}) already exists`);
                    ArValidationErrors.push(`الرقم التعريفي (${userID}) موجود بالفعل`);
                }

                const userEmailExistence = await UserModel.getUserByEmail(email);
                if (userEmailExistence.length > 0) {
                    EnValidationErrors.push(`Email (${email}) already exists`);
                    ArValidationErrors.push(`البريد الإلكتروني (${email}) موجود بالفعل`);
                }

                // If there are validation errors, store them and do NOT proceed with insertion
                if (EnValidationErrors.length || ArValidationErrors.length) {
                    errors.push({
                        row: rowNumber,
                        EnErrors: EnValidationErrors,
                        ArErrors: ArValidationErrors
                    });
                } else {
                    validatedRows.push({
                        userID,
                        firstName,
                        lastName,
                        email,
                        password,
                        role,
                        departmentID
                    });
                }
            }

            // If any errors exist, stop and return failure response
            if (errors.length > 0) {
                return res.status(400).json({
                    Status: "Error",
                    EnMessage: "File upload failed due to validation errors.",
                    ArMessage: "فشل تحميل الملف بسبب أخطاء التحقق.",
                    Errors: errors
                });
            }

            // If no errors, insert all valid accounts
            await Promise.all(validatedRows.map(user => UserModel.addAccount(user)));

            return res.status(200).json({
                Status: "Success",
                EnMessage: "All accounts have been successfully uploaded.",
                ArMessage: "تم تحميل جميع الحسابات بنجاح."
            });

        } catch (error) {
            console.error("Error uploading accounts:", error);
            return res.status(500).json({
                Status: "Error",
                EnMessage: "An unexpected error occurred.",
                ArMessage: "حدث خطأ غير متوقع.",
                Error: error.message
            });
        }
    }



}

module.exports = UserController;
