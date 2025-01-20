const DeleteModel = require('../models/Delete');
class DeleteController {
    static async deleteTableData (req, res) {
        try {
            await DeleteModel.deleteTableData();
            res.status(200).json({success: true})
        } catch (err) {
            console.error('Error inserting exam:', err);
            res.status(500).json({ Error: "Error inserting exam" });
        }
    }
}

module.exports = DeleteController;