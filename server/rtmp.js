const ClientError = require('./client-error');
const crypto = require('crypto');
module.exports = function rtmp(app, db) {

  app.post('/streams/on_publish', (req, res, next) => {
    if (req.ip !== '::ffff:127.0.0.1') {
      return;
    }
    const { name: channelId, clientid: clientId, addr: ip, psk: streamKey } = req.body;
    if (!channelId || !clientId || !ip || !streamKey) {
      res.sendStatus(404);
    }
    if (channelId.match(/^[a-zA-Z0-9_]+$/) === null) {
      res.sendStatus(404);
    }
    const hashedStreamKey = crypto.createHash('sha256').update(streamKey).digest('hex');
    const sql = `
      select "userId" from "users" where "streamKey" = $1
    `;
    db.query(sql, [hashedStreamKey])
      .then(result => {
        const user = result.rows[0];
        if (!user) {
          res.sendStatus(404);
        }
        if (user.userId !== Number.parseInt(channelId)) {
          res.sendStatus(404);
        }
        const sql = `
          insert into "streams" ("channelId", "streamId", "ip")
          values ($1, $2, $3)
        `;
        const params = [channelId, clientId, ip];
        db.query(sql, params)
          .then(() => {
            res.sendStatus(200);
          });
      })
      .catch(err => { throw new ClientError(err); });
  });

  app.post('/streams/on_publish_done', (req, res, next) => {
    if (req.ip !== '::ffff:127.0.0.1') {
      return;
    }
    const { name } = req.body;
    const sql = `
    delete from streams where "channelId" = $1;
  `;
    db.query(sql, [name]);
  });
};
