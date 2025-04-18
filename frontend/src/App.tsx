import React, { useState, useEffect } from 'react';
import './App.css';

interface Message {
  sender: 'user' | 'agent';
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  // Fetch initial message from backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/') // Assuming backend runs on port 8000
      .then(response => response.json())
      .then(data => {
        setMessages([{ sender: 'agent', text: data.message || 'Agent ready.' }]);
      })
      .catch(error => {
        console.error('Error fetching initial message:', error);
        setMessages([{ sender: 'agent', text: 'Could not connect to agent.' }]);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return; // Don't send empty messages

    const userMessage: Message = { sender: 'user', text: input };
    // Add user message optimistically
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Send message to backend API endpoint
    fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }) // Send message in the format expected by the backend
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data: Message) => {
      // Add agent response to the list
      setMessages(prevMessages => [...prevMessages, data]);
    })
    .catch(error => {
      console.error('Error sending message:', error);
      // Add an error message to the chat
      setMessages(prevMessages => [...prevMessages, { sender: 'agent', text: 'Error: Could not get response from agent.' }]);
    });

    setInput(''); // Clear the input field after sending
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Agent</h1>
      </header>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p><strong>{msg.sender === 'user' ? 'You' : 'Agent'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Send on Enter key
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
