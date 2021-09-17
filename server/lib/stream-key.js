require('dotenv/config');
const crypto = require('crypto');
function StreamKey(id) {
  const key = crypto.randomBytes(32).toString('hex');
  this.key = key;
  this.expire = Date.now() + (1000 * 60 * 60 * 24 * process.env.STREAM_KEY_EXPIRY_DAYS);
}
module.exports = StreamKey;
