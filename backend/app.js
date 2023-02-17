const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages from the client
  socket.on('message', (data) => {
    console.log('Received message from client:', data);

    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Handle disconnection of the client
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});