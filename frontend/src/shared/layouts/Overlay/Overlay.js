import React from 'react';
import {
  oneOfType,
  arrayOf,
  node,
  bool,
  func,
} from 'prop-types';

import { Icon } from '../../components';

import './Overlay.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Overlay = ({ children, isVisible, onCloseButtonClick }) => (
  <div className={`overlay ${isVisible ? 'is-visible' : 'is-hidden'}`}>
    <button
      className="button-circle button-circle-secondary"
      type="button"
      onClick={onCloseButtonClick}
    >
      <Icon type="close" />
    </button>

    {children}

  </div>
);

Overlay.propTypes = {
  isVisible: bool.isRequired,
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  onCloseButtonClick: func.isRequired,
};

export default Overlay;
