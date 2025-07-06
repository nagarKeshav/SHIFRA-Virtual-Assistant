import React, { createContext, useRef, useEffect } from 'react';
import run from '../gemini';

export const datacontext = createContext();

function UserContext({ children }) {
  const recognitionRef = useRef(null);

  function speak(text) {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    // Always use the same female Hindi voice for both languages if available
    const voicesLoaded = new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    });

    voicesLoaded.then((voices) => {
      // Find a female Hindi voice
      let selectedVoice = voices.find(
        (v) =>
          (v.lang === "hi-IN" || v.lang === "hi-GB") &&
          v.name.toLowerCase().includes("female")
      );
      // Fallback to any Hindi voice if female not found
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang === "hi-IN" || v.lang === "hi-GB");
      }
      // Fallback to any available voice if nothing found
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }
      window.speechSynthesis.speak(utterance);
    });
  }

  async function aiResponse(prompt) {
    // Instruct Gemini to always respond as Shifra
    const instruction = `
- Your name is Shifra. 
- If the user asks your name or who you are, always say "My name is Shifra" or "मेरा नाम शिफ्रा है।" 
- If the user speaks in English, reply in English. If the user speaks in Hindi, reply in Hindi. Do not use Marathi.
    `;
    let text = await run(`${instruction}\nUser: ${prompt}`);
    console.log(text);
    speak(text);
    return text;
  }

  useEffect(() => {
    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!speechRecognition) {
      console.error("SpeechRecognition not supported");
      return;
    }
    const recognition = new speechRecognition();
    recognition.lang = "hi-IN"; // Set recognition language to Hindi
    recognition.onresult = (e) => {
      let transcript = e.results[e.resultIndex][0].transcript;
      console.log("User said:", transcript);
      aiResponse(transcript);
    };
    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      recognition.onresult = null;
    };
  }, []);

  let value = {
    recognitionRef,
    speak,
    aiResponse,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
