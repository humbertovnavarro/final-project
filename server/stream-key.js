require('dotenv/config');
const crypto = require('crypto');
function StreamKey() {
  const sha256 = crypto.createHash('sha256');
  const key = crypto.randomBytes(32).toString('hex');
  sha256.update(key);
  const hash = sha256.digest('hex');
  this.key = key;
  this.hash = hash;
  this.expire = Date.now() + (1000 * 60 * 60 * 24 * process.env.STREAM_KEY_EXPIRY_DAYS);
}
module.exports = StreamKey;
