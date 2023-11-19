import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatMainPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [shouldCloseChat, setShouldCloseChat] = useState(false);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage) {
      setMessages((messages) => [
        ...messages,
        { text: newMessage, sender: 'user' },
      ]);

      sendMessage(newMessage);

      setNewMessage('');
    }
  };

  const toggleChat = () => {
    setShouldCloseChat(true);
  };

  const sendMessage = async (assistant_message) => {
    setLoading(true);
    const response = await axios.post('http://127.0.0.1:5000/chat', {
      message: assistant_message,
    });

    setMessages((messages) => [
      ...messages,
      { text: response.data.assistant_message, sender: 'bot' },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    if (shouldCloseChat) {
      // Wait for the transition to complete before updating the state
      const timeoutId = setTimeout(() => {
        setChatOpen(false);
        setShouldCloseChat(false);
      }, 300); // Adjust the timeout to match your transition duration

      // Clear the timeout in case the component unmounts before the transition completes
      return () => clearTimeout(timeoutId);
    }
  }, [shouldCloseChat]);

  return (
    <>
      <div
        className={`fixed right-4 bottom-4 w-96 h-96 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${chatOpen ? 'translate-x-0' : 'translate-x-96'}`}
        style={{ position: 'fixed', bottom: 0 }}
      >
        <button
          onClick={toggleChat}
          className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full"
        >
          Close Chat
        </button>
        <h1 className="text-xl font-semibold py-4 px-6">Chatbot</h1>
  
        <div className="px-6 pb-12 flex flex-col h-full overflow-y-auto">
          <div className="chat-messages space-y-2 flex-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  message.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && <div className="p-2 rounded bg-gray-100 self-start">typing...</div>}
          </div>
          
          <div className="absolute bottom-0 w-full bg-gray-50 px-6 py-2 border-t">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleNewMessageChange}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatMainPage;
