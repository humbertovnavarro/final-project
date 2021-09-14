const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
  const token = req.get('X-Access-Token');
  if (!token) {
    return res.status(401).json({
      error: 'No token provided.'
    });
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Invalid token.'
    });
    next();
  }
}
module.exports = authMiddleware;
