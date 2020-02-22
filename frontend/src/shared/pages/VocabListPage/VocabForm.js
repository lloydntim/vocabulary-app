import React from 'react';
import {
  string,
  func,
} from 'prop-types';

const VocabForm = ({
  sourceLanguageInputValue,
  targetLanguageInputValue,
  sourceTextInputValue,
  targetTextInputValue,
  onSourceLanguageInputChange,
  onTargetLanguageInputChange,
  onSourceTextInputChange,
  onTargetTextInputChange,
  submitVocabButtonText,
  onSubmitVocabButtonClick,
}) => (
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
      onClick={onSubmitVocabButtonClick}
    >
      {submitVocabButtonText}
    </button>
  </form>
);

VocabForm.propTypes = {
  sourceLanguageInputValue: string.isRequired,
  targetLanguageInputValue: string.isRequired,
  sourceTextInputValue: string.isRequired,
  targetTextInputValue: string.isRequired,
  submitVocabButtonText: string.isRequired,
  onSourceLanguageInputChange: func.isRequired,
  onTargetLanguageInputChange: func.isRequired,
  onSourceTextInputChange: func.isRequired,
  onTargetTextInputChange: func.isRequired,
  onSubmitVocabButtonClick: func.isRequired,
};

export default VocabForm;
