const multer = require('multer');
const os = require('os');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, (Math.floor(Date.now() * Math.random())).toString());
  }
});
const uploadsMiddleware = multer({storage: storage}).single('avatar');
module.exports = uploadsMiddleware;
