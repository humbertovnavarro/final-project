require('dotenv/config');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const urlMiddleware = express.urlencoded({ extended: false });
const app = express();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(staticMiddleware);

app.use(errorMiddleware);

app.use(urlMiddleware);

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

app.get('/api/users/:id', (req, res, next) => {
  const id = req.params.id;
  if (Number.parseInt(id) < 0) {
    throw new ClientError(400, 'Invalid user id');
  }
  const sql = `
    select ("userName") from "users"
    where "userId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(data => {
      res.json(data.rows);
    }).catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
