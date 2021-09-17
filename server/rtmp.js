const db = require('./db');
module.exports = function rtmp(app) {
  app.post('/streams/on_publish', (req, res, next) => {
    if (req.ip !== '::ffff:127.0.0.1') {
      return;
    }
    const { name: channelId, clientid: clientId, addr: ip, k: streamKey } = req.body;
    if (!clientId || !ip || !streamKey) {
      res.sendStatus(404);
      return;
    }
    let sql = 'select "userId" from users where "streamKey" = $1';
    let params = [streamKey];
    db.query(sql, params)
      .then(data => {
        if (data.rows.length === 0) {
          res.sendStatus(404);
          return;
        }
        const { userId } = data.rows[0];
        if (userId !== Number.parseInt(channelId, 10)) {
          throw new Error('id mismatch');
        }
        sql = `insert into "streams" ("streamId","channelId", "ip")
        values ($1, $2, $3)`;
        params = [clientId, userId, ip];
        db.query(sql, params)
          .then(() => {
            res.sendStatus(201);
          }).catch(err => {
            console.error(err);
            res.sendStatus(500);
          });
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  });
};
