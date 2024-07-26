// departmentController.js
const departmentModel = require('../models/Department');

class DepartmentController {
    static async getAllDepartments(req, res) {
        try {
            const departments = await departmentModel.getAllDepartments();
            res.json(departments);
        } catch (error) {
            console.error("Error fetching departments:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }

    static async addDepartment(req, res) {
        const { department_name } = req.body;

        try {
            await departmentModel.addDepartment(department_name);
            res.json({ success: true });
        } catch (error) {
            console.error("Error adding department:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }

    static async deleteDepartment(req, res) {
        const { id } = req.params;

        try {
            await departmentModel.deleteDepartment(id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error deleting department:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }

    static async addLevelToDepartment(req, res) {
        const { id } = req.params;
        const { level, semester } = req.body;

        try {
            await departmentModel.addLevelToDepartment(id, level, semester);
            res.json({ success: true });
        } catch (error) {
            console.error("Error adding level to department:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }

    static async deleteLevelFromDepartment(req, res) {
        const { id } = req.params;
        const { level } = req.body;

        try {
            await departmentModel.deleteLevelFromDepartment(id, level);
            res.json({ success: true });
        } catch (error) {
            console.error("Error deleting level from department:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }
}

module.exports = DepartmentController;
