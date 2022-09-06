import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import './App.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

// services
import translate from './services/translate';

// utils
import { speak } from './utils/speechUtils';

// components
import Loading from './components/Loading';
import PushableButton from './components/PushableButton';
import Transcripts from './components/Transcripts';
import Footer from './components/Footer';
import LanguageSelect from './components/LanguageSelect';

// icons
import MicIcon from '@mui/icons-material/Mic';
import MicNoneIcon from '@mui/icons-material/MicNone';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('EN');
  const [targetLanguage, setTargetLanguage] = useState('ES');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handleSpeak = () => {
    const locales = {
      EN: 'en-US',
      ES: 'es-ES',
    };

    return speak({
      locale: locales[targetLanguage],
      text: translatedText,

      onStart: () => {
        console.log('started');
        setIsSpeaking(true);
      },

      onEnd: () => {
        console.log('ended');
        setIsSpeaking(false);
      },
    });
  };

  useEffect(() => {
    if (!listening && translatedText) {
      handleSpeak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, translatedText]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      <main>
        <LanguageSelect />
        <p>Microphone: {listening ? 'on' : 'off'}</p>

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

          {/* <IOSOnly> */}
          {translatedText && (
            <PushableButton
              style={{ marginLeft: '10px' }}
              disabled={isDisabled}
              text="Speak"
              Icon={() => {
                return <VolumeUpIcon />;
              }}
              onClick={handleSpeak}
            />
          )}
          {/* </IOSOnly> */}
        </div>

        <div className="separator" />
        <Transcripts
          isSpeaking={isSpeaking}
          listening={listening}
          transcript={transcript}
          translatedText={translatedText}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
