import React from 'react';

import smallCheckmarkSvg from './small_checkmark.svg';
import './CheckMarks.scss';

const CheckMarks = props => {
  return (
    <div className={`${props.className} checkmark`} style={{ ...props.style }}>
      <img src={smallCheckmarkSvg} className="small" />
    </div>
  );
};

export default CheckMarks;
