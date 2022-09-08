import { useState } from 'react';
import './Home.css';

import LanguageSelect from '../../components/LanguageSelect';
import SpeechTranslate from '../../components/SpeechTranslate';
import TextTranslate from '../../components/TextTranslate';
import ModeSelect from '../../components/ModeSelect';

function Home() {
  const [mode, setMode] = useState('speech');

  return (
    <>
      <ModeSelect mode={mode} setMode={setMode} />
      <main>
        <LanguageSelect />
        {mode === 'speech' ? <SpeechTranslate /> : <TextTranslate />}
      </main>
    </>
  );
}

export default Home;
