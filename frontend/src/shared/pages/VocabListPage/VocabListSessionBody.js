import React from 'react';
import {
  string,
  number,
  bool,
  func,
} from 'prop-types';

import { Message } from '../../components';

/* eslint-disable react/jsx-props-no-spreading */
const VocabListSessionBody = ({
  vocabsTotalCount,
  currentVocab,
  vocabSourceText,
  vocabTranslationInputValue,
  isVocabTranslationCorrect,
  vocabTranslationStatusMessage,
  onVocabTranslationInputChange,
  onVocabTranslationInputFocus,
  onVocabTranslationSubmitButtonClick,
}) => (
  <>
    <small>{`${currentVocab} / ${vocabsTotalCount}`}</small>

    <p>{vocabSourceText}</p>

    <label htmlFor="translation">
      <textarea
        id="translation"
        className={`message message-${vocabTranslationStatusMessage}`}
        rows="4"
        value={vocabTranslationInputValue}
        placeholder="Enter translation"
        onFocus={onVocabTranslationInputFocus}
        onChange={onVocabTranslationInputChange}
      />
    </label>

    <button
      className={`button button-secondary ${vocabTranslationInputValue < 1 ? 'is-disabled' : ''}`}
      disabled={vocabTranslationInputValue < 1}
      type="button"
      onClick={onVocabTranslationSubmitButtonClick}
    >
      Submit
    </button>

    {isVocabTranslationCorrect && (vocabsTotalCount === currentVocab) && <Message type="success" content="You have successfully completed this session." /> }
  </>
);

VocabListSessionBody.propTypes = {
  vocabsTotalCount: number.isRequired,
  currentVocab: number.isRequired,
  vocabSourceText: string.isRequired,
  vocabTranslationInputValue: string.isRequired,
  isVocabTranslationCorrect: bool.isRequired,
  vocabTranslationStatusMessage: string.isRequired,
  onVocabTranslationInputChange: func.isRequired,
  onVocabTranslationInputFocus: func.isRequired,
  onVocabTranslationSubmitButtonClick: func.isRequired,
};

export default VocabListSessionBody;
