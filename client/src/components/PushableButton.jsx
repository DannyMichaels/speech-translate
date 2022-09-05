// https://www.joshwcomeau.com/animation/3d-button/

import React from 'react';
import './PushableButton.css';

function PushableButton({ text = 'Push Me', Icon, ...rest }) {
  return (
    <button {...rest} className="pushable">
      <span className="shadow"></span>
      <span className="edge"></span>
      <span className="front">
        {text}
        {Icon ? <Icon /> : null}
      </span>
    </button>
  );
}

export default PushableButton;
