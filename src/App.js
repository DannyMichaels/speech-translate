import { useState, useEffect, useRef } from 'react';
import './App.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import Say from 'react-say';
import translate from './services/translate';

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('EN');
  const [targetLanguage, setTargetLanguage] = useState('ES');
  const [text, setText] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();


  useEffect(() => {
    const translateMe = async () => {

      if (!listening && transcript) {
        const newText = await translate({ text: transcript, sourceLanguage, targetLanguage })
        setText(newText);
      }
    }

    translateMe();
  }, [sourceLanguage, targetLanguage, listening, transcript])

  const onResetClick = () => {
    resetTranscript();
    setText('');
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
  
     {!listening && transcript && text ? <Say text={text} /> : null}
    

      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={onResetClick}>Reset</button>
      <p id="transcript">{transcript}</p>
    </div>
  );
}

export default App;
