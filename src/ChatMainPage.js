import React, { useState, useRef } from 'react';
import axios from 'axios';

function ChatMainPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const recognition = useRef(null);
  const [chatOpen, setChatOpen] = useState(true);

  // Corrected the function declaration and added missing handleNewMessageChange function
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
    setChatOpen(!chatOpen);
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

  const startSpeechRecognition = () => {
    recognition.current = new window.webkitSpeechRecognition();

    recognition.current.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
    };

    recognition.current.onend = () => {
      console.log('Speech recognition ended');
    };

    recognition.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

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
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
</svg>

              </button>
              <button
                onClick={startSpeechRecognition}
                className="p-2 bg-green-500 text-white rounded-lg ml-2"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
</svg>


              </button>
              <button
                onClick={stopSpeechRecognition}
                className="p-2 bg-red-500 text-white rounded-lg ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatMainPage;