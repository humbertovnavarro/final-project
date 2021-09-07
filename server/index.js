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
  const { name, clientid: clientId, addr: ip } = req.body;
  if (name.match(/^[a-zA-Z0-9_]+$/) === null) {
    return next(new ClientError('Invalid stream name', 400));
  }
  // We can trust the rest of the fields because they're coming from NGINX
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

app.post('/streams/on_done', (req, res, next) => {
  // We can trust everything here because it's already bene handled.
  const { clientid: clientId } = req.body;
  const sql = `
    delete from streams
    where "streamId" = $1
  `;
  const params = [clientId];
  db.query(sql, params)
    .then(data => {
      res.sendStatus(200);
    }).catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
