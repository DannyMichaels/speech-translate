import React from 'react';
import Box from '@mui/material/Box';
import ComboBox from './ComboBox';

const defaultOpts = [
  { label: 'English', value: 'EN', code: 'US' },
  { label: 'Español', value: 'ES', code: 'ES' },
];

function LanguageSelect({ onChange, value, options = defaultOpts }) {
  return (
    <div className="row align-center justify-between gap-20">
      <ComboBox
        label={
          navigator.language.toLowerCase().includes('es')
            ? 'lengua origen'
            : 'source language'
        }
        value={'EN'}
        options={options}
        renderOption={renderOption}
      />

      <ComboBox
        label={
          navigator.language.toLowerCase().includes('es')
            ? 'idioma de destino'
            : 'target language'
        }
        value={'ES'}
        options={options}
        renderOption={renderOption}
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
