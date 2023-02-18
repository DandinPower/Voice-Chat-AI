require('dotenv').config()
const https = require('https');

const SPEECH_REGION = process.env.SPEECH_REGION
const SPEECH_KEY = process.env.SPEECH_KEY

const requestBody = `<?xml version="1.0"?><speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-christopherNeural'><prosody pitch="high">yuko! you are so cute! i love you so much</prosody></voice></speak>`;

const options = {
  hostname: `${SPEECH_REGION}.tts.speech.microsoft.com`,
  path: '/cognitiveservices/v1',
  method: 'POST',
  headers: {
    'Ocp-Apim-Subscription-Key': SPEECH_KEY,
    'Content-Type': 'application/ssml+xml',
    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
    'User-Agent': 'curl'
  }
};

const SERVER_PORT = process.env.SERVER_PORT
const CLIENT_HOST = process.env.CLIENT_HOST

const io = require('socket.io')(SERVER_PORT, {
  cors: {
    origin: [CLIENT_HOST],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

   // Send audio data to the client in chunks
   socket.on('request-audio', () => {
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