const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const User = require('../models/User');

const socketModule = (serverHttp) => {
  const io = socketio(serverHttp);
  io.of('/chat').on('connection', async (socket) => {
    console.log('New conaction');
    const cookies = cookie.parse(socket.request.headers.cookie);
    if (!cookies.token) return;
    const { token } = cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.on('sendMessage', async (message, callback) => {
      if (!decoded)
        return callback({ error: 'Not authorize to access this chat' });
      const user = await User.findByIdAndUpdate(
        decoded.id,
        {
          $push: { chat: { user: decoded.id, message } },
        },
        { new: true },
      ).populate({ path: 'chat.user', select: 'name' });

      callback(user.chat);
    });
    socket.on('disconnect', () => {});
  });
};
module.exports = socketModule;
