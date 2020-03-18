import React from 'react';
import {
  string,
  bool,
  func,
  node,
  arrayOf,
  oneOfType,
} from 'prop-types';

import './Dialog.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Dialog = ({
  title,
  children,
  isVisible,
  cancelButtonText,
  continueButtonText,
  onCancelButtonClick,
  onContinueButtonClick,
}) => (
  <div className={`dialog ${isVisible ? 'is-visible' : 'is-hidden'}`}>
    <div className="content ">
      <h3>{title}</h3>
      <div className="dialog-content">{children}</div>
      <div className="button-group">
        <button
          className="button button-primary"
          type="button"
          onClick={onCancelButtonClick}
        >
          {cancelButtonText}
        </button>
        <button
          className="button button-secondary"
          type="button"
          onClick={onContinueButtonClick}
        >
          {continueButtonText}
        </button>
      </div>
    </div>
  </div>
);

Dialog.defaultProps = {
  continueButtonText: 'Continue',
  cancelButtonText: 'Cancel',
};

Dialog.propTypes = {
  title: string.isRequired,
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  cancelButtonText: string,
  continueButtonText: string,
  isVisible: bool.isRequired,
  onCancelButtonClick: func.isRequired,
  onContinueButtonClick: func.isRequired,
};

export default Dialog;
