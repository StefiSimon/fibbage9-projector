import React from 'react';

import floatSvg from './float.svg';
import './FloatBaloon.scss';

const FloatBaloon = props => {
  return (
    <div className={`${props.className} float-baloon`} style={{ ...props.style }}>
      <img src={floatSvg} className="float-baloon-img" />
    </div>
  );
};

export default FloatBaloon;
