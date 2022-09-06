import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import './App.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

// services
import translate from './services/translate';

// utils
import iosVoices from './utils/iosVoices';

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

  const [translatedText, setTranslatedText] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useLayoutEffect(() => {
    // run this so it asks for permission.
    SpeechRecognition.startListening();
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 0);
  }, []);

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
      const actualVoices = !voices?.length ? iosVoices : voices;

      const VOICES = {
        'en-US': 'en-US',
        ES: 'es-ES',
      };

      const selectedVoice = VOICES[targetLanguage];

      return [...actualVoices].find((v) => v.lang === selectedVoice);
      // return selectedVoice;
    },
    [targetLanguage]
  );

  useEffect(() => {
    const translateMe = async () => {
      try {
        setIsLoading(true);
        if (!listening && transcript) {
          const newTranslation = await translate({
            text: transcript,
            sourceLanguage,
            targetLanguage,
          });
          setTranslatedText(newTranslation);
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

  const handleReset = () => {
    resetTranscript();
    setTranslatedText('');
  };

  const holdButtonListen = useCallback(
    (isTouchStart) => {
      if (isDisabled) return;

      if (isTouchStart) {
        handleReset();

        if (speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          SpeechRecognition.stopListening();
        }
      }

      setTimeout(() => {
        return SpeechRecognition.startListening({ continuous: true });
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDisabled, listening, transcript]
  );

  useEffect(() => {
    if (!listening && translatedText) {
      const utter = new SpeechSynthesisUtterance(translatedText);
      const voices = speechSynthesis.getVoices();

      // utter.voice = voiceSelector(voices);

      utter.volume = 1;

      utter.onstart = () => {
        console.log('started');
      };

      utter.onend = () => {
        console.log('ended');
      };

      window.speechSynthesis.speak(utter);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, translatedText]);

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

        <div className="button__container">
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
        </div>
        {/* <button onClick={handleReset}>Reset</button> */}

        <div className="separator" />
        {!listening && transcript && (
          <div className="transcripts">
            <textarea id="transcript__sourceLanguage" value={transcript} />
            <textarea id="transcript__targetLanguage" value={translatedText} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
