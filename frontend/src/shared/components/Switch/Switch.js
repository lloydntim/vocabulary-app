import React from 'react';
import { string, bool, func } from 'prop-types';

import './Switch.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Switch = ({
  name,
  label,
  isActive,
  onChange,
}) => (
  <label className="switch" htmlFor={name}>
    {label && <span className="switch-label-text">{label}</span>}
    <input
      id={name}
      className="switch-checkbox"
      type="checkbox"
      checked={isActive}
      onChange={onChange}
    />
    <span className="switch-background" />
  </label>
);

Switch.propTypes = {
  name: string.isRequired,
  label: string.isRequired,
  isActive: bool.isRequired,
  onChange: func.isRequired,
};

export default Switch;
