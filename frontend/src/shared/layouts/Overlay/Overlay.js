import React from 'react';
import {
  oneOfType,
  arrayOf,
  node,
  bool,
  func,
  string,
} from 'prop-types';

import { IconButton } from '../../components';

import './Overlay.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Overlay = ({ children, title, isVisible, onCloseButtonClick }) => (
  <div className={`overlay ${isVisible ? 'is-visible' : 'is-hidden'}`}>
    <IconButton
      icon="close"
      type="secondary"
      onClick={onCloseButtonClick}
    />
    {title && <h1>{title}</h1>}
    {children}

  </div>
);

Overlay.defaultProps = {
  title: '',
};

Overlay.propTypes = {
  title: string,
  isVisible: bool.isRequired,
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  onCloseButtonClick: func.isRequired,
};

export default Overlay;
