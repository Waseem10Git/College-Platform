const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: 'uploads/' });

module.exports = upload;
