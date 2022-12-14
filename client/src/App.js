import './App.css';
import { useLayoutEffect } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

// components
import Footer from './components/Footer';
import Home from './screens/Home/Home';

function App() {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();

  useLayoutEffect(() => {
    // run this so it asks for permission.
    SpeechRecognition.startListening();
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 0);
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      <Home />
      <Footer />
    </div>
  );
}

export default App;
