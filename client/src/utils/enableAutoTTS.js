export default function enableAutoTTS() {
  if (typeof window === 'undefined') {
    return;
  }
  var isiOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  // if (!isiOS) {
  //   return;
  // }
  var simulateSpeech = function () {
    console.log('test');
    var lecture = new SpeechSynthesisUtterance('hello');
    // lecture.volume = 0;
    speechSynthesis.speak(lecture);
    document.removeEventListener('click', simulateSpeech);
  };
  document.addEventListener('click', simulateSpeech);

  const unsubscribe = () => {
    // if (!isiOS) {
    //   return;
    // }

    document.removeEventListener('click', simulateSpeech);
  };

  return { unsubscribe };
}
