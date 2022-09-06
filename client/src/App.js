import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import './App.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

// services
import translate from './services/translate';

// components
// import Say from 'react-say';
import Loading from './components/Loading';
import PushableButton from './components/PushableButton';

// icons
import MicIcon from '@mui/icons-material/Mic';
import MicNoneIcon from '@mui/icons-material/MicNone';
import Footer from './components/Footer';

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('EN');
  const [targetLanguage, setTargetLanguage] = useState('ES');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  const [text, setText] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useLayoutEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // removes anything 'stuck'
      speechSynthesis.getVoices();
      // Safari loads voices synchronously so now safe to enable
      setDisabled(false);
    }
  }, []);

  const voiceSelector = useCallback(
    (voices) => {
      const VOICES = {
        'en-US': 'en-US',
        ES: 'es-ES',
      };

      const selectedVoice = VOICES[targetLanguage];

      // return [...voices].find((v) => v.lang === selectedVoice);
      return selectedVoice;
    },
    [targetLanguage]
  );

  useEffect(() => {
    const translateMe = async () => {
      try {
        setIsLoading(true);
        if (!listening && transcript) {
          const newText = await translate({
            text: transcript,
            sourceLanguage,
            targetLanguage,
          });
          setText(newText);
        }
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    translateMe();
  }, [sourceLanguage, targetLanguage, listening, transcript]);

  useLayoutEffect(() => {
    // run this so it asks for permission.
    SpeechRecognition.startListening();
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 0);
  }, []);

  const handleReset = () => {
    resetTranscript();
    setText('');
  };

  const holdButtonListen = useCallback(
    (touchStart) => {
      if (isDisabled) return;

      if (touchStart) {
        handleReset();
      }
      return SpeechRecognition.startListening({ continuous: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDisabled]
  );

  useEffect(() => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = voiceSelector();
    window.speechSynthesis.speak(utter);
  }, [text, voiceSelector]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (error) {
    return (
      <pre>
        <code>{JSON.stringify(error, null, 2)}</code>
      </pre>
    );
  }

  return (
    <div className="App">
      <main>
        {/* {!listening && text ? <Say text={text} voice={voiceSelector} /> : null} */}

        <p>Microphone: {listening ? 'on' : 'off'}</p>

        {/* <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button> */}

        {!isLoading ? (
          <PushableButton
            disabled={isDisabled}
            text={!listening ? 'Push to talk' : 'Release'}
            Icon={() => {
              if (listening) return <MicIcon />;

              return <MicNoneIcon />;
            }}
            onTouchStart={() => holdButtonListen(true)}
            onMouseDown={holdButtonListen}
            onMouseLeave={SpeechRecognition.stopListening}
            onTouchEnd={SpeechRecognition.stopListening}
            onMouseUp={SpeechRecognition.stopListening}
          />
        ) : (
          <Loading />
        )}
        {/* <button onClick={handleReset}>Reset</button> */}

        <p id="transcript">{transcript}</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
