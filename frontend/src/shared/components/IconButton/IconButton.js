import React from 'react';
import { string, bool, func } from 'prop-types';
import Icon from '../Icon';

import './IconButton.scss';

const IconButton = ({
  rank,
  type,
  tabIndex,
  disabled,
  onClick,
  onMouseUp,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
}) => (
  <button
    className={`icon-button icon-type-${type} ${disabled ? 'is-disabled' : `icon-button-rank-${rank}`}`}
    type="button"
    tabIndex={tabIndex}
    disabled={disabled}
    onClick={onClick}
    onMouseUp={onMouseUp}
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    <Icon type={type} />
  </button>
);

IconButton.propTypes = {
  type: string.isRequired,
  rank: string.isRequired,
  tabIndex: string,
  disabled: bool,
  onClick: func,
  onMouseUp: func,
  onMouseDown: func,
  onTouchStart: func,
  onTouchEnd: func,
};

IconButton.defaultProps = {
  disabled: false,
  tabIndex: null,
  onClick: () => null,
  onMouseUp: () => null,
  onMouseDown: () => null,
  onTouchStart: () => null,
  onTouchEnd: () => null,
};

export default IconButton;
