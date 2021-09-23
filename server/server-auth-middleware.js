require('dotenv/config');
function authMiddleware(req, res, next) {
  const token = req.get('X-Access-Token');
  if (token === process.env.RTMP_SERVER_SECRET) {
    next();
  } else {
    res.sendStatus(404);
  }
}
module.exports = authMiddleware;
