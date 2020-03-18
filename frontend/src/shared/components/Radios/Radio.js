import React from 'react';
import {
  string,
  bool,
  func,
  number,
  oneOfType,
} from 'prop-types';

/* eslint-disable react/jsx-props-no-spreading */
const Radio = ({
  name,
  value,
  label,
  checked,
  onChange,
}) => (
  <label className="radio" htmlFor={name}>
    <input
      id={name}
      value={value}
      className="radio-input"
      type="radio"
      checked={checked}
      onChange={onChange}
    />
    <span className="radio-background" />
    {label && <span className="radio-label">{label}</span>}
  </label>
);

Radio.defaultProps = {
  label: '',
};

Radio.propTypes = {
  name: string.isRequired,
  label: string,
  value: oneOfType([
    string,
    number,
  ]).isRequired,
  checked: bool.isRequired,
  onChange: func.isRequired,
};

export default Radio;
