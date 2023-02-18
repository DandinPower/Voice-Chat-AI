import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import ReactPlayer from 'react-player';

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;
const socket = io.connect(SERVER_HOST);

function App() {
  const [audioChunks, setAudioChunks] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const [textInput, setTextInput] = useState('');

  const requestAudioData = useCallback((text) => {
    // Clear the current audio chunks
    setAudioChunks([]);

    // Request audio data from the server
    socket.emit('request-audio', text);

    // Receive audio data from the server
    const audioChunkHandler = (chunk) => {
      setAudioChunks((chunks) => [...chunks, chunk]);
    };
    
    socket.on('audio-chunk', audioChunkHandler);
    
    // End of audio data
    socket.on('audio-end', () => {
      console.log('Audio stream ended');
      socket.off('audio-chunk', audioChunkHandler);
      socket.off('audio-end');
    });

  }, []);

  useEffect(() => {
    // Create the URL for the audio data
    const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    setUrl(audioUrl);
  }, [audioChunks]);

  return (
    <div>
      <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
      <button onClick={() => {
        requestAudioData(textInput);
        setPlaying(true);
      }}>Play</button>
      {url && (
        <ReactPlayer
          url={url}
          playing={playing}
          onEnded={() => setPlaying(false)}
        />
      )}
    </div>
  );
}

export default App;
