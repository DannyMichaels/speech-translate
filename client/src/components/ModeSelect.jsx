import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function ModeSelect({ mode, setMode }) {
  return (
    <div className="Home__ModeSelect">
      <Typography sx={{ fontSize: '24px', padding: '10px', margin: '10px' }}>
        Select Mode:
      </Typography>
      <Button
        disabled={mode === 'speech'}
        variant="contained"
        onClick={() => setMode('speech')}>
        Speech translate
      </Button>
      <Button
        disabled={mode === 'text'}
        variant="contained"
        onClick={() => setMode('text')}>
        Text translate
      </Button>
    </div>
  );
}

export default ModeSelect;
