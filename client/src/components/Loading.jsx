import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useInterval from '../hooks/useInterval';

function Loading() {
  const [dots, setDots] = useState('.');

  const updateDots = (initialState = '.', maxLength = 3) => {
    if (dots.length === maxLength) {
      return setDots(initialState);
    }

    setDots((prevState) => (prevState += '.'));
  };

  useInterval(updateDots, 1000);

  return (
    <Stack mt={4} mb={4} p={2}>
      <CircularProgress size={60} />
      <Typography component="h1" mt={2}>
        Loading{dots}
      </Typography>
    </Stack>
  );
}

export default Loading;
