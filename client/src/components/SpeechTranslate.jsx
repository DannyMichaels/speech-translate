import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useLanguageStore } from '../stores/language-store';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

// components
import Transcripts from './Transcripts';
import IOSOnly from './IOSOnly';
import PushableButton from './PushableButton';
import Loading from './Loading';

// icons
import MicIcon from '@mui/icons-material/Mic';
import MicNoneIcon from '@mui/icons-material/MicNone';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// utils
import { locales, locales2 } from '../utils/constants';
import { speak } from '../utils/speechUtils';
import { isIOS } from '../utils/userAgent';

// services
import translate from '../services/translate';

function SpeechTranslate() {
  const isIos = isIOS();
  const { sourceLanguage, targetLanguage } = useLanguageStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [translatedText, setTranslatedText] = useState('');

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

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
            sourceLanguage: sourceLanguage,
            targetLanguage: locales2[targetLanguage],
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
    return speak({
      locale: locales[targetLanguage],
      text: translatedText,
    });
  };

  useEffect(() => {
    if (!listening && translatedText) {
      handleSpeak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, translatedText]);

  return (
    <div className="Home__SpeechTranslate">
      <IOSOnly>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
      </IOSOnly>

      <div className="button__container">
        <IOSOnly>
          {!isLoading ? (
            <>
              <PushableButton
                disabled={isDisabled}
                text="Start"
                onClick={() => {
                  window.speechSynthesis.cancel();
                  SpeechRecognition.stopListening();
                  SpeechRecognition.startListening();
                }}
              />
              {listening && (
                <PushableButton
                  disabled={isDisabled}
                  text="Stop"
                  onClick={SpeechRecognition.stopListening}
                />
              )}
            </>
          ) : (
            <Loading />
          )}
        </IOSOnly>

        {!isIos && (
          <>
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
          </>
        )}

        {translatedText && !listening && (
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
      </div>

      <div className="separator" />
      <Transcripts
        isSpeaking={speechSynthesis.speaking}
        listening={listening}
        transcript={transcript}
        translatedText={translatedText}
      />
    </div>
  );
}

export default SpeechTranslate;
