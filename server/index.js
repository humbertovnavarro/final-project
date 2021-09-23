require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const jsonMiddleware = express.json();
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const serverAuthMiddleware = require('./server-auth-middleware');
app.use(staticMiddleware);
app.use(jsonMiddleware);
require('./routes')(app);
require('./chat')(io);

app.use(serverAuthMiddleware);
require('./server-routes')(app);

http.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
