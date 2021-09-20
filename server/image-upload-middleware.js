const multer = require('multer');
const storage = multer.memoryStorage();
const uploadsMiddleware = multer({ storage: storage }).single('avatar');
module.exports = uploadsMiddleware;
