require('dotenv').config()

const SPEECH_REGION = process.env.SPEECH_REGION
const SPEECH_KEY = process.env.SPEECH_KEY
const SERVER_PORT = process.env.SERVER_PORT
const CLIENT_HOST = process.env.CLIENT_HOST

const https = require('https')
const cors = require('cors')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: [CLIENT_HOST],
  },
})

app.use(cors())
app.set(express.static('public')) 

const options = {
  hostname: `${SPEECH_REGION}.tts.speech.microsoft.com`,
  path: '/cognitiveservices/v1',
  method: 'POST',
  headers: {
    'Ocp-Apim-Subscription-Key': SPEECH_KEY,
    'Content-Type': 'application/ssml+xml',
    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
    'User-Agent': 'curl'
  },
};

io.on('connection', (socket) => {
  console.log('A user connected');
   socket.on('request-audio', (text) => {
    let requestBody = `<?xml version="1.0"?><speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-christopherNeural'><prosody pitch="high">${text}</prosody></voice></speak>`;
    console.log('new request')
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        socket.emit('audio-chunk', chunk);
      });
      res.on('end', () => {
        socket.emit('audio-end');
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.write(requestBody);

    req.end();
  });

  // Handle disconnection of the client
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(SERVER_PORT)

