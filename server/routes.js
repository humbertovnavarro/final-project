const ClientError = require('./client-error');
module.exports = function routes(app, db) {

  app.get('/api/channel/:id', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (id < 0 || Number.isNaN(id)) {
      throw new ClientError(400, 'Invalid user id');
    }
    const sql = `
    select "userName" from "users" where "userId" = $1;
  `;
    const params = [id];
    db.query(sql, params)
      .then(data => {
        res.json(data.rows[0]);
      }).catch(err => next(err));
  });

  app.get('/api/channel/:id/status', (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (id < 0 || Number.isNaN(id)) {
      throw new ClientError(400, 'Invalid user id');
    }
    const sql = `
      select count(*) from "users" left join "streams"
      on "userId" = "channelId"
      where "channelId" = $1
    `;
    const params = [id];
    db.query(sql, params)
      .then(data => {
        res.json({ isLive: (data.rows[0].count > 0) });
      })
      .catch(err => next(err));
  });
};
