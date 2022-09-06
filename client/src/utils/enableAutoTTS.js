import { isIOS } from './userAgent';

export function enableAutoTTS() {
  if (typeof window === 'undefined') {
    return;
  }
  const isiOS = isIOS();

  if (!isiOS) {
    return;
  }
  const simulateSpeech = () => {
    const lecture = new SpeechSynthesisUtterance('hello');
    lecture.volume = 0;
    speechSynthesis.speak(lecture);
    document.removeEventListener('click', simulateSpeech);
  };

  document.addEventListener('click', simulateSpeech);
}
