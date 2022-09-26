const express = require('express')
const bodyParser = require('body-parser')
const http = require('http') 
const { Server } = require('socket.io')
const router = require('./routes/messageRoute.js')
const path = require('path')

var app = express()
const server = http.createServer(app)
const PORT = 3000 || process.env.PORT
const io = new Server(server)
const buildUrl = (version, path) => `/${version}/${path}`
const BASE_URL = buildUrl('v1', 'chat')

// Set EJS as templating engine
app.set('view engine', 'ejs')
app.set('views', path.join('views'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set('socketio', io);
app.use(BASE_URL, router)

// The render method takes the name of the HTML page to be 
// rendered as input. This page should be in the views folder.
app.get('/', (req, res) =>
  res.render('index'))

// Run when client connects
const users = new Set()
io.on('connection', socket => {
  console.log(`${socket.id} connected...`)

  socket.on('join', (username) => {
    console.log(`${username} has joined the chat!`);
    users.add(username)
    socket.user = username
    //Send the username to all clients currently connected
    io.emit("join", [...users]);
  })

  socket.on('typing', (data) => socket.broadcast.emit('typing', data))

  socket.on("disconnect", () => {
    users.delete(socket.user);
    socket.broadcast.emit("user disconnected", socket.user);
  });

})

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})
