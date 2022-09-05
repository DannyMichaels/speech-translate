import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const selectedVoice = useMemo(() => {
    const VOICES = {
      'en-US': 'en-US',
      ES: 'es-ES',
    };

    return VOICES[targetLanguage];
  }, [targetLanguage]);

  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const voiceSelector = useCallback(
    (voices) => {
      const VOICES = {
        'en-US': 'en-US',
        ES: 'es-ES',
      };

      const selectedVoice = VOICES[targetLanguage];

      return [...voices].find((v) => v.lang === selectedVoice);
    },
    [targetLanguage]
  );

  useEffect(() => {
    const translateMe = async () => {
      if (!listening && transcript) {
        const newText = await translate({
          text: transcript,
          sourceLanguage,
          targetLanguage,
        });
        setText(newText);
      }
    };

    translateMe();
  }, [sourceLanguage, targetLanguage, listening, transcript]);

  const onResetClick = () => {
    resetTranscript();
    setText('');
  };

  useEffect(() => {
    console.log({ SpeechRecognition });
    // SpeechRecognition;
    // SpeechRecognition?.addEventListener(
    //   'end',
    //   () => {
    //     console.log('ended');

    //     // setText('')
    //   },
    //   []
    // );
  }, []);

  const holdButtonListen = () =>
    SpeechRecognition.startListening({ continuous: true });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      {!listening && transcript && text ? (
        <Say text={text} voice={voiceSelector} />
      ) : null}

      <p>Microphone: {listening ? 'on' : 'off'}</p>
      {/* <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button> */}

      <button
        onTouchStart={holdButtonListen}
        onMouseDown={holdButtonListen}
        onTouchEnd={SpeechRecognition.stopListening}
        onMouseUp={SpeechRecognition.stopListening}>
        Hold to talk
      </button>

      <button onClick={onResetClick}>Reset</button>
      <p id="transcript">{transcript}</p>
    </div>
  );
}

export default App;
