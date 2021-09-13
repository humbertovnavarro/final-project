const crypto = require('crypto');
function StreamKey() {
  const sha256 = crypto.createHash('sha256');
  let key = '';
  const possible =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  '0123456789';
  for (let i = 0; i < 32; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  sha256.update(key);
  const hash = sha256.digest('hex');
  this.key = key;
  this.hash = hash;
}
module.exports = StreamKey;
