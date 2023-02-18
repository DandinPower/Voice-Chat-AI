require('dotenv').config()
const https = require('https');
const fs = require('fs');

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

const req = https.request(options, (res) => {
  const audioWriteStream = fs.createWriteStream('output.mp3');
  res.pipe(audioWriteStream);
  audioWriteStream.on('finish', () => {
    console.log('Audio file saved to disk');
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(requestBody);

req.end();