import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  string,
  func,
  bool,
  number,
  shape,
  arrayOf,
  oneOfType,
} from 'prop-types';

import { Message, AutoComplete } from '../../components';

const VocabForm = ({
  sourceLanguageInputValue,
  targetLanguageInputValue,
  sourceTextInputValue,
  targetTextInputValue,
  sourceLanguageDataList,
  targetLanguageDataList,
  status,
  translateVocabButtonText,
  submitVocabButtonText,
  onInputFocus,
  onSourceLanguageInputChange,
  onTargetLanguageInputChange,
  onSourceLanguageDataListClick,
  onTargetLanguageDataListClick,
  onSourceTextInputChange,
  onTargetTextInputChange,
  onTranslateVocabButtonClick,
  onSubmitVocabButtonClick,
}) => {
  const { t } = useTranslation();
  return (
    <form>
      <AutoComplete
        value={sourceLanguageInputValue}
        placeholder={t('vocablist_form_placeholder_selectSourceLanguage')}
        onFocus={onInputFocus}
        dataList={sourceLanguageDataList}
        onChange={onSourceLanguageInputChange}
        onClick={onSourceLanguageDataListClick}
      />
      <label htmlFor="source-text">
        <span>{t('vocablist_form_label_sourceText')}</span>
        <input
          name="source-text"
          type="text"
          placeholder={(t('vocablist_form_placeholder_sourceText'))}
          value={sourceTextInputValue}
          onFocus={onInputFocus}
          onChange={onSourceTextInputChange}
        />
      </label>
      <div className="separator" />
      <AutoComplete
        value={targetLanguageInputValue}
        placeholder={(t('vocablist_form_placeholder_selectTargetLanguage'))}
        onFocus={onInputFocus}
        dataList={targetLanguageDataList}
        onChange={onTargetLanguageInputChange}
        onClick={onTargetLanguageDataListClick}
      />
      <label htmlFor="target-text">
        <span>{t('vocablist_form_label_targetText')}</span>
        <input
          name="target-text"
          type="text"
          placeholder={(t('vocablist_form_placeholder_targetText'))}
          value={targetTextInputValue}
          onFocus={onInputFocus}
          onChange={onTargetTextInputChange}
        />
      </label>
      {translateVocabButtonText && (
        <button
          className="button button-secondary"
          type="button"
          onClick={onTranslateVocabButtonClick}
        >
          {translateVocabButtonText}
        </button>
      )}
      <button
        className="button button-secondary"
        type="button"
        onClick={onSubmitVocabButtonClick}
      >
        {submitVocabButtonText}
      </button>
      { status && <Message type="error" id="status" content={status} /> }
    </form>
  );
};
VocabForm.defaultProps = {
  translateVocabButtonText: '',
};

VocabForm.propTypes = {
  sourceLanguageInputValue: string.isRequired,
  targetLanguageInputValue: string.isRequired,
  sourceTextInputValue: string.isRequired,
  targetTextInputValue: string.isRequired,
  sourceLanguageDataList: arrayOf(shape({
    value: oneOfType([string, number, bool]),
    text: string,
  })).isRequired,
  targetLanguageDataList: arrayOf(shape({
    value: oneOfType([string, number, bool]),
    text: string,
  })).isRequired,
  status: string.isRequired,
  translateVocabButtonText: string,
  submitVocabButtonText: string.isRequired,
  onInputFocus: func.isRequired,
  onSourceLanguageInputChange: func.isRequired,
  onTargetLanguageInputChange: func.isRequired,
  onSourceTextInputChange: func.isRequired,
  onTargetTextInputChange: func.isRequired,
  onSourceLanguageDataListClick: func.isRequired,
  onTargetLanguageDataListClick: func.isRequired,
  onTranslateVocabButtonClick: func.isRequired,
  onSubmitVocabButtonClick: func.isRequired,
};

export default VocabForm;
