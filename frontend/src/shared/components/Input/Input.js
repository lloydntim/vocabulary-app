import React, { useState } from 'react';
import { string, func } from 'prop-types';

import './Input.scss';
import IconButton from '../IconButton/IconButton';

/* eslint-disable react/jsx-props-no-spreading */
const Input = ({
  label,
  autoComplete,
  name,
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  const isTypePassword = type === 'password';
  const [inputType, setInputType] = useState('password');
  const inputTypeName = isTypePassword ? inputType : type;
  return (
    <label className={`input input-type-${inputTypeName}`} htmlFor={name}>
      <span className="input-label">{label}</span>
      <input
        className="input-element"
        autoComplete={autoComplete}
        name={name}
        type={inputTypeName}
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => onChange(target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {type === 'password' && (
        <IconButton
          icon="view"
          type="primary"
          onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
        />
      )}
    </label>
  );
};

Input.defaultProps = {
  label: '',
  autoComplete: '',
  type: 'text',
  placeholder: '',
  onChange: null,
  onFocus: null,
  onBlur: null,
};

Input.propTypes = {
  label: string,
  autoComplete: string,
  type: string,
  name: string.isRequired,
  placeholder: string,
  value: string.isRequired,
  onChange: func,
  onFocus: func,
  onBlur: func,
};

export default Input;
