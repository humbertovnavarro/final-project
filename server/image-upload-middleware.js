const multer = require('multer');
const uploadsMiddleware = multer({}).single('avatar');
module.exports = uploadsMiddleware;
