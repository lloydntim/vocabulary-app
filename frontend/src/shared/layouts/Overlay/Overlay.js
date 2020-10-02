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
  <>
    {isVisible && (
      <div className={`overlay ${isVisible ? 'is-visible' : 'is-hidden'}`}>
        <div className="overlay-button-close">
          <IconButton
            type="close"
            rank="secondary"
            onClick={onCloseButtonClick}
          />
        </div>

        <div className="overlay-content">
          {title && <h1>{title}</h1>}
          {children}
        </div>
      </div>
    )}
  </>
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
