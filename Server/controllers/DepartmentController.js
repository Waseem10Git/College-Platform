// controllers/DepartmentController.js
const DepartmentModel = require('../models/Department');

class DepartmentController {
    static async getAllDepartments(req, res) {
        try {
            const departments = await DepartmentModel.getAllDepartments();
            res.json(departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static async addDepartment(req, res) {
        const { department_name } = req.body;
        try {
            if (!department_name) return res.status(404).json({ Status: "Error", Message: "Department name is empty" });

            const isExist = await DepartmentModel.getDepartmentByName(department_name);
            if (isExist.length > 0) return res.status(404).json({ Status: "Error", Message: "Department is exist" });

            await DepartmentModel.addDepartment(department_name);
            return res.json({ success: true });
        } catch (error) {
            console.error('Error adding department:', error);
            return res.status(500).json({ message: 'Server Error', error });
        }
    }

    static async updateDepartment(req, res) {
        const { id } = req.params;
        const { department_name } = req.body;
        try {
            if (!department_name) return res.status(404).json({ Status: "Error", Message: "Department name is empty" });

            const isExist = await DepartmentModel.getDepartmentByName(department_name);
            if (isExist.length > 0) return res.status(404).json({ Status: "Error", Message: "Department is exist" });

            await DepartmentModel.updateDepartment(id, department_name);
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating department:', error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static async deleteDepartment(req, res) {
        const { id } = req.params;
        try {
            if (!id) return res.status(404).json({ Status: "Error", Message: "Department ID is empty" });

            const isExist = await DepartmentModel.getDepartmentById(id);
            if (!isExist.length > 0) return res.status(404).json({ Status: "Error", Message: "Department is not exist" });

            await DepartmentModel.deleteDepartment(id);
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting department:', error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static async addLevelToDepartment(req, res) {
        const { id } = req.params;
        const { level, semester } = req.body;
        try {
            await DepartmentModel.addLevelToDepartment(id, level, semester);
            res.json({ success: true });
        } catch (error) {
            console.error('Error adding level to department:', error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static async deleteLevelFromDepartment(req, res) {
        const { id } = req.params;
        const { level } = req.body;
        try {
            await DepartmentModel.deleteLevelFromDepartment(id, level);
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting level from department:', error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }
}

module.exports = DepartmentController;
