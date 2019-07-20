    
import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import './EnterPincode.scss';
import Input from '../../../shared/Input/Input';

const EnterPincode = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ pincode: '' }}
      onSubmit={onSubmit}
      render={({ errors }) => (
        <Form>
          <label htmlFor="pincode" className="page-transition-elem">
            Enter a PINCODE
          </label>
          <Input
            id="pincode"
            name="pincode"
            type="number"
            placeholder="PINCODE"
            errors={errors}
          />
          {/* <ErrorMessage component="span" name="pincode" /> */}
          <button type="submit" className="page-transition-elem">
            DISPLAY PINCODE
          </button>
        </Form>
      )}
    />
  );
};

export default EnterPincode;