import React from 'react';
import { useTranslation } from 'react-i18next';
import { string, func, arrayOf } from 'prop-types';

import { Message, AutoComplete } from '../../components';

const VocabForm = ({
  sourceLanguageInputValue,
  targetLanguageInputValue,
  sourceTextInputValue,
  targetTextInputValue,
  sourceLanguageDataList,
  targetLanguageDataList,
  status,
  submitVocabButtonText,
  onInputFocus,
  onSourceLanguageInputChange,
  onTargetLanguageInputChange,
  onSourceLanguageDataListClick,
  onTargetLanguageDataListClick,
  onSourceTextInputChange,
  onTargetTextInputChange,
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

VocabForm.propTypes = {
  sourceLanguageInputValue: string.isRequired,
  targetLanguageInputValue: string.isRequired,
  sourceTextInputValue: string.isRequired,
  targetTextInputValue: string.isRequired,
  sourceLanguageDataList: arrayOf(string).isRequired,
  targetLanguageDataList: arrayOf(string).isRequired,
  status: string.isRequired,
  submitVocabButtonText: string.isRequired,
  onInputFocus: func.isRequired,
  onSourceLanguageInputChange: func.isRequired,
  onTargetLanguageInputChange: func.isRequired,
  onSourceTextInputChange: func.isRequired,
  onTargetTextInputChange: func.isRequired,
  onSourceLanguageDataListClick: func.isRequired,
  onTargetLanguageDataListClick: func.isRequired,
  onSubmitVocabButtonClick: func.isRequired,
};

export default VocabForm;
