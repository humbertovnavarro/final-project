require('dotenv/config');
const pg = require('pg');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const urlMiddleware = express.urlencoded({ extended: false });
const jsonMiddleware = express.json();
const app = express();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.query('DELETE FROM "streams"');

app.use(staticMiddleware);
app.use(urlMiddleware);
require('./rtmp')(app, db);
app.use(jsonMiddleware);
require('./routes')(app, db);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
