import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import ReactPlayer from 'react-player';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;
const socket = io.connect(SERVER_HOST);

function App() {
  const [audioChunks, setAudioChunks] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('en-US-DavisNeural');

  const requestAudioData = useCallback((text, option) => {
    // Clear the current audio chunks
    setAudioChunks([]);

    // Request audio data from the server
    socket.emit('request-audio', text, option);

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

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    requestAudioData(textInput, selectedOption);
    setPlaying(true);
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="textInput">
              <Form.Label>Enter Text</Form.Label>
              <Form.Control type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="selectOption">
              <Form.Label>Select a Voice</Form.Label>
              <Form.Control as="select" value={selectedOption} onChange={handleSelectChange}>
                <option value="en-US-DavisNeural">en-US-DavisNeural</option>
                <option value="en-US-CoraNeural">en-US-CoraNeural</option>
                <option value="en-US-AshleyNeural">en-US-AshleyNeural</option>
              </Form.Control>
            </Form.Group>
            <br/>
            <Button variant="primary" type="submit">
              Play
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          {url && (
            <ReactPlayer
              url={url}
              playing={playing}
              onEnded={() => setPlaying(false)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
