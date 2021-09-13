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
