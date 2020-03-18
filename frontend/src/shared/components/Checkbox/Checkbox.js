import React from 'react';
import { string, bool, func } from 'prop-types';

import './Checkbox.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Checkbox = ({
  name,
  label,
  checked,
  onChange,
}) => (
  <label className="checkbox-container" htmlFor={name}>
    {label && <span className="checkbox-label">{label}</span>}
    <input
      id={name}
      className="checkbox"
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
    <span className="checkbox-background" />
  </label>
);

Checkbox.defaultProps = {
  label: '',
};

Checkbox.propTypes = {
  name: string.isRequired,
  label: string,
  checked: bool.isRequired,
  onChange: func.isRequired,
};

export default Checkbox;
