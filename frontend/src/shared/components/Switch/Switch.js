import React from 'react';
import { string, bool, func } from 'prop-types';

import './Switch.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Switch = ({
  name,
  label,
  isActive,
  disabled,
  onChange,
}) => (
  <label className={`switch ${disabled ? 'is-disabled' : ''} ${isActive ? 'is-active' : ''}`} htmlFor={name}>
    {label && <span className="switch-label-text">{label}</span>}
    <input
      id={name}
      disabled={disabled}
      className="switch-checkbox"
      type="checkbox"
      checked={isActive}
      onChange={onChange}
    />
    <span className="switch-background" />
  </label>
);

Switch.defaultProps = {
  disabled: false,
};

Switch.propTypes = {
  name: string.isRequired,
  label: string.isRequired,
  isActive: bool.isRequired,
  disabled: bool,
  onChange: func.isRequired,
};

export default Switch;
