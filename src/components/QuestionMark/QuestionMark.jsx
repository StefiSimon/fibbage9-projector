import React from 'react';

import questionmarkSvg from './questionmark.svg';
import './QuestionMark.scss';

const QuestionMark = props => {
  return (
    <div className={`${props.className} questionmark`} style={{ ...props.style }}>
      <img src={questionmarkSvg} className="questionmark-img" />
    </div>
  );
};

export default QuestionMark;
