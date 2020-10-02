import React from 'react';
import { string, bool, func } from 'prop-types';

import './Button.scss';

const Button = ({
  text,
  type,
  rank,
  tabIndex,
  disabled,
  onClick,
  onMouseUp,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
}) => (
  /* eslint-disable react/button-has-type */
  <button
    type={type}
    tabIndex={tabIndex}
    className={`button button-rank-${rank} ${disabled ? 'is-disabled' : ''}`}
    disabled={disabled}
    onClick={(event) => {
      if (type === 'submit') {
        event.preventDefault();
      }
      onClick();
    }}
    onMouseUp={onMouseUp}
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    {text}
  </button>
);

Button.defaultProps = {
  rank: 'primary',
  type: 'submit',
  tabIndex: null,
  disabled: false,
  onClick: null,
  onMouseUp: null,
  onMouseDown: null,
  onTouchStart: null,
  onTouchEnd: null,
};

Button.propTypes = {
  text: string.isRequired,
  type: string,
  tabIndex: string,
  rank: string,
  disabled: bool,
  onClick: func,
  onMouseUp: func,
  onMouseDown: func,
  onTouchStart: func,
  onTouchEnd: func,
};

export default Button;
