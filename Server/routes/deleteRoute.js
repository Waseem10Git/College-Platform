const express = require('express');
const router = express.Router();
const DeleteController = require('../controllers/DeleteController');
const asyncHandler = require('express-async-handler');

router.delete('/tablesData', asyncHandler(DeleteController.deleteTableData));

module.exports = router;