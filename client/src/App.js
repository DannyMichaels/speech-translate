import './App.css';
import { useSpeechRecognition } from 'react-speech-recognition';

// components
import Footer from './components/Footer';
import Home from './screens/Home/Home';

function App() {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();

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
