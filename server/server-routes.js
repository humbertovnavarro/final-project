require('dotenv/config');
const db = require('./db');
module.exports =
function(app) {

  app.get(`/${process.env.SECRET_ROUTE}/streamkey/:userId`, (req, res) => {
    if(!req.params.userId || req.params.userId <= 0) {
      res.sendStatus(400);
      return;
    }
    const sql = `
      select "streamKey" from users where "userId" = $1
      limit 1;
    `;
    const params = [req.params.userId];
    db.query(sql, params)
    .then( data => {
      res.status(200).json(data.rows[0]);
    })
    .catch( err => {
      console.error(err);
      res.status(500);
    });
  });

  app.post(`/${process.env.SECRET_ROUTE}/stream`, (req, res) => {
    const sql = `insert into "streams" ("streamId", "channelId", "ip", "url")
    values ($1, $2, $3, $4)`;
    const params = req.body;
    if(params.length === 4 && req.streamId && req.channelId && req.ip && req.url) {
      db.query(sql,params)
      .then( () => { res.sendStatus(201) })
    }
    res.sendStatus(400);
  });

  app.delete(`/${process.env.SECRET_ROUTE}/stream/:channelId`, (req, res) => {
    const channelId = req.params.channelId;
    const sql = `delete from streams where "channelId" = $1`;
    db.query(sql, [channelId])
    .then( () => {
      res.sendStatus(410);
    })
    .catch(err => {
      console.err(err);
      res.sendStatus(500);
    });
  });

}
