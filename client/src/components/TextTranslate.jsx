import { useState } from 'react';
import { useLanguageStore } from './../stores/language-store';

// components
import { TextareaAutosize, Grid } from '@mui/material';
import PushableButton from './PushableButton';
import Loading from './Loading';

// utils
import { locales, locales2 } from '../utils/constants';
import translate from '../services/translate';
import { speak } from '../utils/speechUtils';

// icons
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

function TextTranslate() {
  const { sourceLanguage, targetLanguage } = useLanguageStore();
  const [text, setText] = useState('');
  const [translateResult, setTranslateResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const result = await translate({
        text,
        sourceLanguage: sourceLanguage,
        targetLanguage: locales2[targetLanguage],
      });

      setTranslateResult(result);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const aliases = {
    EN: 'English',
    ES: 'Español',
  };

  const handleSpeak = () => {
    return speak({
      locale: locales[targetLanguage],
      text: translateResult,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid
      component="form"
      container
      onSubmit={handleSubmit}
      className="Home__TextTranslate"
      spacing={2}
      justifyContent="center"
      mt={2}>
      <Grid item>
        <TextareaAutosize
          id="input__sourceLanguage"
          minRows={5}
          placeholder={`Type in ${aliases[sourceLanguage]}`}
          value={text}
          onChange={(e) => {
            if (translateResult) {
              setTranslateResult('');
            }

            setText(e.target.value);
          }}
        />
      </Grid>

      {translateResult && (
        <Grid item>
          <TextareaAutosize
            id="input__targetLanguage"
            minRows={5}
            placeholder={`${aliases[targetLanguage]}`}
            value={translateResult}
            onChange={(e) => e.preventDefault()}
          />
        </Grid>
      )}

      <Grid item container alignItems="center" justifyContent="center" mt={2}>
        {!translateResult ? (
          <PushableButton
            type="submit"
            text={`Translate to ${aliases[targetLanguage]}`}
          />
        ) : (
          <PushableButton
            type="button"
            text="Clear"
            onClick={() => {
              setTranslateResult('');
              setText('');
            }}
          />
        )}

        {translateResult && (
          <PushableButton
            type="button"
            style={{ marginLeft: '10px' }}
            text="Speak"
            Icon={() => {
              return <VolumeUpIcon />;
            }}
            onClick={handleSpeak}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default TextTranslate;
