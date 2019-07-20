import React from 'react';
import anime from 'animejs';
import SVG from 'react-inlinesvg';
import { Field } from 'formik';

import xMark from './x-mark.svg';
import './Input.scss';

const Input = props => {
  const invalid = Object.keys(props.errors).length > 0;

  return (
    <div className={`page-transition-elem input ${invalid && 'invalid'}`}>
      <Field {...props} />
      {invalid && (
        <SVG
          className="error"
          wrapper={React.createFactory('div')}
          src={xMark}
        />
      )}
    </div>
  );
};

export default Input;