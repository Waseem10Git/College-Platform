const DeleteModel = require('../models/Delete');
class DeleteController {
    static async deleteTableData (req, res) {
        try {
            await DeleteModel.deleteTableData();
            res.status(200).json({success: true})
        } catch (err) {
            console.error('Error deleting data tables:', err);
            res.status(500).json({ success: false, EnMessage: 'Sever Error', ArMessage: 'خطأ في الخادم' });
        }
    }
}

module.exports = DeleteController;