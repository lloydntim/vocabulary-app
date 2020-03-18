import React, { useState } from 'react';
import {
  string,
  func,
  arrayOf,
  shape,
  number,
} from 'prop-types';

import Radio from './Radio';

import './Radios.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Radios = ({
  className,
  items,
  selectedItem,
  onChange,
}) => {
  const [selectedRadio, setSelectedRadio] = useState(selectedItem);
  return (
    <div className={`radios ${className}`}>
      {items.map(({ label, value }, index) => (
        <Radio
          key={index}
          value={value}
          name={`radio-${index}`}
          checked={selectedRadio === index}
          label={label}
          onChange={({ target: { value } }) => {
            setSelectedRadio(index);
            onChange({ label, value, index });
          }}
        />
      ))}
    </div>
  );
};

Radios.defaultProps = {
  className: '',
  selectedItem: 0,
};

Radios.propTypes = {
  className: string,
  items: arrayOf(shape({
    label: string.isRequired,
    value: string.isRequired,
  })).isRequired,
  selectedItem: number,
  onChange: func.isRequired,
};

export default Radios;
