import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ReactPlayer from 'react-player';

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST

const socket = io.connect(SERVER_HOST);



function App() {
  const [audioChunks, setAudioChunks] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Request audio data from the server
    socket.emit('request-audio');

    // Receive audio data from the server
    socket.on('audio-chunk', (chunk) => {
      setAudioChunks((chunks) => [...chunks, chunk]);
    });
    
    // End of audio data
    socket.on('audio-end', () => {
      console.log('Audio stream ended');
    });

    // Clean up the socket listener on unmount
    return () => {
      socket.off('audio-chunk');
      socket.off('audio-end');
    };
  }, []);

  return (
    <div>
      <button onClick={() => setPlaying(true)}>Play</button>
      <ReactPlayer
        url={URL.createObjectURL(new Blob(audioChunks))}
        playing={playing}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

export default App;
