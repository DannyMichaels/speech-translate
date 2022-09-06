import React from 'react';

function Transcripts({ isSpeaking, listening, transcript, translatedText }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ margin: '20px', minHeight: '20px', maxHeight: '20px' }}>
        {/* {!isSpeaking ? transcript : null} */}
      </div>
      <div className="transcripts">
        {!listening && transcript && (
          <>
            <textarea
              id="transcript__sourceLanguage"
              value={transcript}
              style={{ width: '100%' }}
            />
            <textarea
              id="transcript__targetLanguage"
              value={translatedText}
              style={{ width: '100%' }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Transcripts;
