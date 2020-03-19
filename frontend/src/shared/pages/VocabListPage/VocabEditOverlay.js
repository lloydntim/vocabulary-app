import React from 'react';
import {
  string,
  bool,
  func,
  number,
  shape,
  oneOfType,
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
  translateVocabButtonText,
  updateVocabButtonText,
  onTranslateVocabButtonClick,
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
      translateVocabButtonText={translateVocabButtonText}
      submitVocabButtonText={updateVocabButtonText}
      onTranslateVocabButtonClick={onTranslateVocabButtonClick}
      onSubmitVocabButtonClick={onUpdateVocabButtonClick}
    />
  </Overlay>
);

VocabEditOverlay.defaultProps = {
  translateVocabButtonText: '',
};

VocabEditOverlay.propTypes = {
  title: string.isRequired,
  sourceLanguageDataList: arrayOf(shape({
    value: oneOfType([string, number, bool]),
    text: string,
  })).isRequired,
  targetLanguageDataList: arrayOf(shape({
    value: oneOfType([string, number, bool]),
    text: string,
  })).isRequired,
  sourceLanguageInputValue: string.isRequired,
  targetLanguageInputValue: string.isRequired,
  sourceTextInputValue: string.isRequired,
  targetTextInputValue: string.isRequired,
  translateVocabButtonText: string,
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
  onTranslateVocabButtonClick: func.isRequired,
  onUpdateVocabButtonClick: func.isRequired,
  onCloseButtonClick: func.isRequired,
};

export default VocabEditOverlay;
