const express = require('express');
const app = express();

const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const { log } = require('console');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
  console.log('connected to socket.io');
});

app.get('/', function(req, res) {
  res.render('index');
});

server.listen(3000);
console.log('Server is running on port 3000');
