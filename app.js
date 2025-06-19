const express = require('express');
const app = express();

const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const userLocations = {};

io.on('connection', function(socket) {
    // Send all current locations to the new user
    socket.emit('all-locations', userLocations);

    socket.on('send-location', function(data) {
        userLocations[socket.id] = { id: socket.id, ...data };
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', function() {
        delete userLocations[socket.id];
        io.emit('user-disconnected', socket.id);
    });
});

app.get('/', function(req, res) {
  res.render('index');
});

server.listen(3000);
console.log('Server is running on port 3000');
