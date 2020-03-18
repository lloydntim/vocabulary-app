import React from 'react';
import {
  string,
  bool,
  func,
  arrayOf,
} from 'prop-types';

import VocabForm from './VocabForm';
import { Overlay } from '../../layouts';

const VocabEditOverlay = ({
  title,
  sourceLanguageDataList,
  targetLanguageDataList,
  sourceLanguageInputValue,
  targetLanguageInputValue,
  sourceTextInputValue,
  targetTextInputValue,
  status,
  isVisible,
  onInputFocus,
  onSourceLanguageInputChange,
  onTargetLanguageInputChange,
  onSourceLanguageDataListClick,
  onTargetLanguageDataListClick,
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

    <VocabForm
      sourceLanguageDataList={sourceLanguageDataList}
      targetLanguageDataList={targetLanguageDataList}
      sourceLanguageInputValue={sourceLanguageInputValue}
      targetLanguageInputValue={targetLanguageInputValue}
      sourceTextInputValue={sourceTextInputValue}
      targetTextInputValue={targetTextInputValue}
      onInputFocus={onInputFocus}
      onSourceLanguageInputChange={onSourceLanguageInputChange}
      onTargetLanguageInputChange={onTargetLanguageInputChange}
      onSourceLanguageDataListClick={onSourceLanguageDataListClick}
      onTargetLanguageDataListClick={onTargetLanguageDataListClick}
      onSourceTextInputChange={onSourceTextInputChange}
      onTargetTextInputChange={onTargetTextInputChange}
      status={status}
      submitVocabButtonText={updateVocabButtonText}
      onSubmitVocabButtonClick={onUpdateVocabButtonClick}
    />
  </Overlay>
);

VocabEditOverlay.propTypes = {
  title: string.isRequired,
  sourceLanguageDataList: arrayOf(string).isRequired,
  targetLanguageDataList: arrayOf(string).isRequired,
  sourceLanguageInputValue: string.isRequired,
  targetLanguageInputValue: string.isRequired,
  sourceTextInputValue: string.isRequired,
  targetTextInputValue: string.isRequired,
  updateVocabButtonText: string.isRequired,
  status: string.isRequired,
  isVisible: bool.isRequired,
  onInputFocus: func.isRequired,
  onSourceLanguageInputChange: func.isRequired,
  onTargetLanguageInputChange: func.isRequired,
  onSourceLanguageDataListClick: func.isRequired,
  onTargetLanguageDataListClick: func.isRequired,
  onSourceTextInputChange: func.isRequired,
  onTargetTextInputChange: func.isRequired,
  onUpdateVocabButtonClick: func.isRequired,
  onCloseButtonClick: func.isRequired,
};

export default VocabEditOverlay;
