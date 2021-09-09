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
    insert into streams ("streamId", "channelId", "ip")
    values ($1, $2, $3)
  `;
    const params = [clientId, name, ip];
    db.query(sql, params)
      .then(data => {
        res.sendStatus(200);
      }).catch(err => next(err));
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
