import logo from './logo.svg';
import './App.css';
// import useSpeech from './hooks/useSpeech';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

function App() {
  // const { words, speech, recognitionRef } = useSpeech();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={() => SpeechRecognition.startListening()}>Start</button>
      <button onClick={() => SpeechRecognition.stopListening()}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p id="transcript">{transcript}</p>
    </div>
  );
}

export default App;
