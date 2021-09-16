const db = require('./db');
const jwt = require('jsonwebtoken');
function authorize(socket) {
  const token = socket.handshake.auth.token;
  const room = socket.handshake.auth.room;
  if (!room) {
    socket.emit('auth-error', 'No room specified');
    socket.disconnect();
    return;
  }
  if (token === 'anonymous') {
    socket.userId = 0;
    socket.userName = 'Anonymous' + Math.floor(Math.random() * 100000);
    socket.room = room;
    socket.join(room);
    socket.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  } else {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      console.error('Error', err);
      socket.emit('auth-error', 'Invalid token');
      socket.disconnect();
      return;
    }
    socket.userId = decoded.userId;
    const sql = `
        select "color", "userName" from "users" where "userId" = $1
      `;
    db.query(sql, [socket.userId])
      .then(data => {
        socket.userName = data.rows[0].userName || 'Anonymous';
        socket.color = data.rows[0].color;
      });
    socket.room = room;
    socket.join(room);
  }
}
module.exports = authorize;
