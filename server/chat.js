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
      if(message.length <= 0) {
        socket.emit('error', 'Message must be at least 1 character long');
        return;
      }
      if(message.length > 200) {
        socket.emit('error', 'Message must be less than 200 characters');
        return;
      }
      if (socket.userId === null) {
        socket.emit('error', 'You are not authorized to send messages');
        return;
      }
      const sql = `
        insert into "messages"
        ("userId", "channelId", "userName", "content")
        values ($1, $2, $3, $4)
        returning *;
      `;
      const params = [socket.userId, socket.room, socket.userName, message];
      db.query(sql, params)
        .then(data => {
          io.sockets.in(socket.room).emit('message', data.rows[0]);
        }).catch(err => {
          console.error(err);
          socket.emit('error', 'An unexpected error has occured');
        });
    });
  });
}
module.exports = chat;
