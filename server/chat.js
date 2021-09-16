const db = require('./db');
const authorize = require('./io-auth');

function chat(io) {
  io.on('connection', function (socket) {
    authorize(socket);
    socket.on('message', data => {
      const message = data.trim();
      if (typeof message !== 'string') {
        socket.emit('error', 'Message must be a string');
        return;
      }
      if (message.length <= 0) {
        socket.emit('error', 'Message must be at least 1 character long');
        return;
      }
      if (message.length >= 500) {
        socket.emit('error', 'Message must be less than 500 characters');
        return;
      }
      if (socket.userId === null) {
        socket.emit('error', 'You are not authorized to send messages');
        return;
      }
      const sql = `
        insert into "messages"
        ("userId", "channelId", "userName", "content", "color")
        values ($1, $2, $3, $4, $5)
        returning *;
      `;
      const params = [socket.userId, socket.room, socket.userName, message, socket.color];
      db.query(sql, params)
        .then(data => {
          const payload = data.rows[0];
          io.sockets.in(socket.room).emit('message', payload);
        }).catch(err => {
          console.error(err);
          socket.emit('error', 'An unexpected error has occured');
        });
    });
  });
}
module.exports = chat;
