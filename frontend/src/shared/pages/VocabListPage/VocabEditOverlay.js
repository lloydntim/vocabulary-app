import React from 'react';
import {
  string,
  bool,
  func,
} from 'prop-types';

import { Overlay } from '../../layouts';

const VocabEditOverlay = ({
  title,
  sourceLanguageInputValue,
  targetLanguageInputValue,
  sourceTextInputValue,
  targetTextInputValue,
  isVisible,
  onSourceLanguageInputChange,
  onTargetLanguageInputChange,
  onSourceTextInputChange,
  onTargetTextInputChange,
  updateVocabButtonText,
  onUpdateVocabButtonClick,
  onCloseButtonClick,
}) => (
  <Overlay
    isVisible={isVisible}
    onCloseButtonClick={onCloseButtonClick}
  >
    <h1>{title}</h1>

    <form>
      <label htmlFor="source-language">
        <span>Source Language</span>
        <input
          name="source-language"
          type="text"
          placeholder="Enter Source Language"
          value={sourceLanguageInputValue}
          onChange={onSourceLanguageInputChange}
        />
      </label>
      <label htmlFor="source-text">
        <span>Source Text</span>
        <input
          name="source-text"
          type="text"
          placeholder="Enter Source Text"
          value={sourceTextInputValue}
          onChange={onSourceTextInputChange}
        />
      </label>
      <div className="separator" />
      <label htmlFor="target-language">
        <span>Target Language</span>
        <input
          name="target-language"
          type="text"
          placeholder="Enter Target Language"
          value={targetLanguageInputValue}
          onChange={onTargetLanguageInputChange}
        />
      </label>
      <label htmlFor="target-text">
        <span>Target Text</span>
        <input
          name="target-text"
          type="text"
          placeholder="Enter Target Text"
          value={targetTextInputValue}
          onChange={onTargetTextInputChange}
        />
      </label>
      <button
        className="button button-secondary"
        type="button"
        onClick={onUpdateVocabButtonClick}
      >
        {updateVocabButtonText}
      </button>
    </form>
  </Overlay>
);

VocabEditOverlay.propTypes = {
  title: string.isRequired,
  sourceLanguageInputValue: string.isRequired,
  targetLanguageInputValue: string.isRequired,
  sourceTextInputValue: string.isRequired,
  targetTextInputValue: string.isRequired,
  updateVocabButtonText: string.isRequired,
  isVisible: bool.isRequired,
  onSourceLanguageInputChange: func.isRequired,
  onTargetLanguageInputChange: func.isRequired,
  onSourceTextInputChange: func.isRequired,
  onTargetTextInputChange: func.isRequired,
  onUpdateVocabButtonClick: func.isRequired,
  onCloseButtonClick: func.isRequired,
};

export default VocabEditOverlay;
