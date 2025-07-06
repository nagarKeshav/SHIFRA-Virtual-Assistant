import React, { useContext } from 'react';
import './App.css';
import ai from "./assets/ai.png";
import { datacontext } from './context/UserContext.jsx';
import { CiMicrophoneOn } from "react-icons/ci";

function App() {
  const { recognitionRef } = useContext(datacontext);

  const handleMicClick = () => {
    if (recognitionRef && recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Speech recognition not ready.");
    }
  };

  return (
    <div className='main'>
      <img src={ai} alt="" id='shifra' />
      <span>I'm Shifra, your advanced virtual assistant</span>
      <button onClick={handleMicClick}>
        Click me <CiMicrophoneOn />
      </button>
    </div>
  );
}

export default App;
