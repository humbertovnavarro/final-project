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
  if (!token) {
    socket.userId = null;
    socket.userName = 'Anonymous';
    socket.room = room;
    socket.join(room);
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
        select "userName" from "users" where "userId" = $1
      `;
    db.query(sql, [socket.userId])
      .then(data => {
        socket.userName = data.rows[0].userName || 'Anonymous';
      });
    socket.room = room;
    socket.join(room);
  }
}
module.exports = authorize;
