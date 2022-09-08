import './Home.css';

import LanguageSelect from '../../components/LanguageSelect';
import SpeechTranslate from '../../components/SpeechTranslate';

function Home() {
  return (
    <main>
      <LanguageSelect />
      <SpeechTranslate />
    </main>
  );
}

export default Home;
