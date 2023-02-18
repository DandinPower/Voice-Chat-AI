require('dotenv').config()
const speech = require('./speech')
const cors = require('cors')
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [process.env.CLIENT_HOST],
  },
})

app.use(cors())
app.set(express.static('public')) 

io.on('connection', speech.handleConnection)

module.exports = { io, server }