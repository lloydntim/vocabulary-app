import React from 'react';
import {
  string,
  bool,
  func,
} from 'prop-types';

import './Dialog.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Dialog = ({
  title,
  message,
  isVisible,
  cancelButtonText,
  continueButtonText,
  onCancelButtonClick,
  onContinueButtonClick,
}) => (
  <div className={`dialog ${isVisible ? 'is-visible' : 'is-hidden'}`}>
    <div className="content ">
      <h3>{title}</h3>
      <p>{message}</p>
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

Dialog.propTypes = {
  title: string.isRequired,
  message: string.isRequired,
  cancelButtonText: string.isRequired,
  continueButtonText: string.isRequired,
  isVisible: bool.isRequired,
  onCancelButtonClick: func.isRequired,
  onContinueButtonClick: func.isRequired,
};

export default Dialog;
