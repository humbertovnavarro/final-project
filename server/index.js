require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const urlMiddleware = express.urlencoded({ extended: false });
const jsonMiddleware = express.json();
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./db');

db.query('DELETE FROM "streams"');

app.use(staticMiddleware);
app.use(urlMiddleware);
require('./rtmp')(app);
app.use(jsonMiddleware);
require('./routes')(app);
require('./chat')(io);
http.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
