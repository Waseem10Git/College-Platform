const express = require('express');
const router = express.Router();
const DeleteController = require('../controllers/DeleteController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.delete('/tablesData', verifyToken, asyncHandler(DeleteController.deleteTableData));

module.exports = router;