require('dotenv').config()
const https = require('https')
const SPEECH_REGION = process.env.SPEECH_REGION
const SPEECH_KEY = process.env.SPEECH_KEY
const {GetGPTResponse} = require('./chat')

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
}

function handleConnection(socket) {
  console.log('A user connected')
  socket.on('request-audio', async (text, voice) => {
    let gptResponse = await GetGPTResponse(text)
    let requestBody = `<?xml version="1.0"?><speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='${voice}'><prosody pitch="high">${gptResponse}</prosody></voice></speak>`;
    console.log('new request')
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        socket.emit('audio-chunk', chunk);
      })
      res.on('end', () => {
        socket.emit('audio-end');
      })
    })
    req.on('error', (error) => {
      console.error(error)
    })
    req.write(requestBody)
    req.end()
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  })
}

module.exports = {handleConnection}