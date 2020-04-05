import React from 'react';
import { string, bool, func } from 'prop-types';

import './Button.scss';

const Button = ({
  text,
  type,
  disabled,
  onClick,
  onMouseUp,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
}) => (
  <button
    type="button"
    className={`button button-type-${type} ${disabled ? 'is-disabled' : ''}`}
    disabled={disabled}
    onClick={onClick}
    onMouseUp={onMouseUp}
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    {text}
  </button>
);

Button.defaultProps = {
  disabled: false,
  onClick: null,
  onMouseUp: null,
  onMouseDown: null,
  onTouchStart: null,
  onTouchEnd: null,
};

Button.propTypes = {
  text: string.isRequired,
  type: string.isRequired,
  disabled: bool,
  onClick: func,
  onMouseUp: func,
  onMouseDown: func,
  onTouchStart: func,
  onTouchEnd: func,
};

export default Button;
