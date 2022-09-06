import React from 'react';
import Box from '@mui/material/Box';
import ComboBox from './ComboBox';
import { useLanguageStore } from '../stores/language-store';

const defaultOpts = [
  { label: 'English', value: 'EN', code: 'US' },
  { label: 'Español', value: 'ES', code: 'ES' },
];

function LanguageSelect({ options = defaultOpts }) {
  const {
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
  } = useLanguageStore();

  return (
    <div className="row align-center justify-center gap-20 flex-wrap">
      <ComboBox
        label={
          navigator.language.toLowerCase().includes('es')
            ? 'lengua origen'
            : 'source language'
        }
        value={sourceLanguage}
        options={options}
        renderOption={renderOption}
        onChange={(_, opt) => setSourceLanguage(opt.value)}
      />

      <ComboBox
        label={
          navigator.language.toLowerCase().includes('es')
            ? 'idioma de destino'
            : 'target language'
        }
        value={targetLanguage}
        options={options}
        renderOption={renderOption}
        onChange={(_, opt) => setTargetLanguage(opt.value)}
      />
    </div>
  );
}

function renderOption(props, option) {
  return (
    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      <img
        loading="lazy"
        width="20"
        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
        alt={option.label}
      />
      {option.label} ({option.code})
    </Box>
  );
}
export default LanguageSelect;
