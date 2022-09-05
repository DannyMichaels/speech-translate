import { useState, useMemo, useEffect, useRef } from 'react';

export default function useSpeech() {
  const [speech, setSpeech] = useState(true);
  const [words, setWords] = useState([]);

  const SpeechRecognition = useMemo(() => {
    return window?.SpeechRecognition || window?.webkitSpeechRecognition;
  }, []);

  const recognitionRef = useRef(new SpeechRecognition());

  useEffect(() => {
    if (recognitionRef.current && !recognitionRef?.current?.interimResults) {
      recognitionRef.current.interimResults = true;
    }

    recognitionRef.current?.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      setWords(transcript);
      console.log({ transcript });
    });
  }, [recognitionRef]);

  useEffect(() => {
    console.log(recognitionRef.current);
    if (speech) {
      recognitionRef.current?.start();
      recognitionRef.current?.addEventListener(
        'end',
        recognitionRef.current?.start
      );
    }
  }, [speech]);

  return { words, speech, recognitionRef };
}
