import React from 'react';
import { string, bool, func } from 'prop-types';
import Icon from '../Icon';

import './IconButton.scss';

const IconButton = ({
  icon,
  type,
  disabled,
  onClick,
  onMouseUp,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
}) => (
  <button
    className={`icon-button icon-type-${icon} ${disabled ? 'is-disabled' : `icon-button-type-${type}`}`}
    type="button"
    disabled={disabled}
    onClick={onClick}
    onMouseUp={onMouseUp}
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    <Icon type={icon} />
  </button>
);

IconButton.propTypes = {
  icon: string.isRequired,
  type: string.isRequired,
  disabled: bool,
  onClick: func,
  onMouseUp: func,
  onMouseDown: func,
  onTouchStart: func,
  onTouchEnd: func,
};

IconButton.defaultProps = {
  disabled: false,
  onClick: () => null,
  onMouseUp: () => null,
  onMouseDown: () => null,
  onTouchStart: () => null,
  onTouchEnd: () => null,
};

export default IconButton;
