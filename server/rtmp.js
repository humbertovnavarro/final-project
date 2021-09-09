const ClientError = require('./client-error');
module.exports = function rtmp(app, db) {
  app.post('/streams/on_publish', (req, res, next) => {
    if (req.ip !== '::ffff:127.0.0.1') {
      return;
    }
    const { name, clientid: clientId, addr: ip } = req.body;
    if (name.match(/^[a-zA-Z0-9_]+$/) === null) {
      return next(new ClientError('Invalid stream name', 400));
    }
    const sql = `
    insert into streams ("streamId", "channelId", "ip", "isLive")
    values ($1, $2, $3, $4)
    on conflict ("streamId")
    do update set "channelId" = $2, "ip" = $3, "isLive" = $4;
  `;
    const params = [clientId, name, ip, true];
    db.query(sql, params)
      .then(data => {
        res.sendStatus(200);
      }).catch(err => next(err));
  });

  app.post('/streams/on_done', (req, res, next) => {
    if (req.ip !== '::ffff:127.0.0.1') {
      return;
    }
    const { clientid: clientId } = req.body;
    const sql = `
    update streams set "isLive" = false where "streamId" = $1;
  `;
    db.query(sql, [clientId]);
  });
};
