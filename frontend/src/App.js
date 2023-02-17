import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Send a message to the server when the user submits the form
  const handleSubmit = (event) => {
    event.preventDefault();

    socket.emit('message', inputValue);
    setInputValue('');
  };

  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (data) => {
      setMessages((messages) => [...messages, data]);
    });
  }, []);

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
