// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import ChatMainPage from './ChatMainPage';
function App() {


  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  return (
    <>
    <div
           style={{
             position: "fixed",
             bottom: "0",
             right: "0",
             marginRight: "20px",
             marginBottom: "20px",
           }}
         >
           <button
             className="p-3 bg-opacity-50"
             onClick={toggleChat}
             style={{ borderRadius: "50%" }}
           >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth="2"
               stroke="currentColor"
               className="w-8 h-8"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
               />
             </svg>
           </button>
         </div>
    
         {chatOpen && (
           <div style={{ marginLeft: "20px" }}>
             <ChatMainPage />
           </div>
         )}
   </>
  );
}

export default App;
