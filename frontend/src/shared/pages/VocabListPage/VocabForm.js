import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { func, bool, object, string } from 'prop-types';

import { Input, Button } from '../../components';

const VocabForm = ({
  id,
  form,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSourceLanguageDataListClick,
  onTargetLanguageDataListClick,
  isEditMode,
  onTranslateVocabButtonClick,
  onSubmitVocabButtonClick,
}) => {
  const {
    formData: {
      sourceLanguage, targetLanguage, sourceText, targetText,
    },
    updateFormData,
    setInitFormData,
    isFormValid,
  } = form;
  const { t, i18n } = useTranslation();

  const languages = [
    { value: 'en', text: t('common_languages_english') },
    { value: 'de', text: t('common_languages_german') },
    { value: 'es', text: t('common_languages_spanish') },
    { value: 'fr', text: t('common_languages_french') },
    { value: 'pt', text: t('common_languages_portuguese') },
  ];

  const sourceLanguageLabel = `vocablist_form_label_${isEditMode ? 'sourceLanguage' : 'translateFrom'}`;
  const sourceTextLabel = `vocablist_form_label_${isEditMode ? 'sourceText' : 'text'}`;
  const targetLanguageLabel = `vocablist_form_label_${isEditMode ? 'targetLanguage' : 'translateTo'}`;
  const targetTextLabel = `vocablist_form_label_${isEditMode ? 'targetText' : 'translation'}`;

  if (!isEditMode) {
    useEffect(() => {
      /* eslint-disable no-undef */
      const sourceLanguageCookieKey = `source-language-${id}`;
      const targetLanguageCookieKey = `target-language-${id}`;

      if (typeof Cookies.get(sourceLanguageCookieKey) === 'undefined') {
        Cookies.set(sourceLanguageCookieKey, i18n.language);
      }

      if (typeof Cookies.get(targetLanguageCookieKey) === 'undefined') {
        Cookies.set(targetLanguageCookieKey, '');
      }

      const [sourceLanguage] = languages.filter(({ value }) => value === Cookies.get(sourceLanguageCookieKey).substr(0, 2));
      const targetLanguage = !Cookies.get(targetLanguageCookieKey) ? '' : languages.filter(({ value }) => value === Cookies.get(targetLanguageCookieKey))[0].text;
      setInitFormData({ sourceLanguage: sourceLanguage.text, targetLanguage, sourceText: '' });
    }, []);
  }

  return (
    <form className={`vocab-form ${isEditMode ? 'is-edit-mode' : 'is-add-mode'}`}>
      <Input
        label={t(sourceLanguageLabel)}
        inputRef={sourceLanguage.ref}
        value={sourceLanguage.value}
        required
        requiredErrorMessage={t('messages_error_pleaseSelectLanguage')}
        placeholder={t('vocablist_form_placeholder_selectSourceLanguage')}
        autoComplete="off"
        name={sourceLanguage.name}
        dataList={languages}
        onChange={(data) => {
          updateFormData(data);
          if (onSourceLanguageChange) onSourceLanguageChange(data);
        }}
        onDataListClick={({ value }) => {
          Cookies.set(`source-language-${id}`, value);
          if (onSourceLanguageDataListClick) onSourceLanguageDataListClick({ value });
        }}
      />
      <Input
        label={t(sourceTextLabel)}
        inputRef={sourceText.ref}
        autoComplete="off"
        name={sourceText.name}
        required
        placeholder={t('vocablist_form_placeholder_sourceText')}
        value={sourceText.value}
        maxLength={150}
        maxLengthErrorMessage={t('messages_error_sourcePhraseMaxLength')}
        requiredErrorMessage={t('messages_error_sourcePhraseEmpty')}
        onChange={updateFormData}
        onBlur={updateFormData}
      />
      <div className="separator" />
      <Input
        label={t(targetLanguageLabel)}
        inputRef={targetLanguage.ref}
        value={targetLanguage.value}
        required
        requiredErrorMessage={t('messages_error_pleaseSelectLanguage')}
        autoComplete="off"
        placeholder={t('vocablist_form_placeholder_selectTargetLanguage')}
        name={targetLanguage.name}
        dataList={languages}
        onChange={(data) => {
          updateFormData(data);
          if (onTargetLanguageChange) onTargetLanguageChange(data);
        }}
        onDataListClick={({ value }) => {
          Cookies.set(`target-language-${id}`, value);
          if (onTargetLanguageDataListClick) onTargetLanguageDataListClick({ value });
        }}
      />
      {isEditMode && (
        <Input
          label={t(targetTextLabel)}
          inputRef={targetText.ref}
          autoComplete="off"
          required
          name={targetText.name}
          placeholder={t('vocablist_form_placeholder_targetText')}
          requiredErrorMessage={t('messages_error_targetPhraseEmpty')}
          value={targetText.value}
          onChange={updateFormData}
          onBlur={updateFormData}
        />
      )}

      {isEditMode ? (
        <Button
          tabIndex={-1}
          disabled={!isFormValid}
          type="secondary"
          text={t('common_button_update')}
          onClick={() => onSubmitVocabButtonClick({
            sourceLanguage: sourceLanguage.value,
            targetLanguage: targetLanguage.value,
            sourceText: sourceText.value,
            targetText: targetText.value,
          })}
        />
      ) : (
        <Button
          disabled={!isFormValid}
          type="tertiary"
          text={t('common_button_translate')}
          onClick={() => {
            onTranslateVocabButtonClick({
              sourceLanguage: sourceLanguage.value,
              targetLanguage: targetLanguage.value,
              sourceLanguageCode: Cookies.get(`source-language-${id}`),
              targetLanguageCode: Cookies.get(`target-language-${id}`),
              sourceText: sourceText.value,
            });
          }}
        />
      )}

    </form>
  );
};
VocabForm.defaultProps = {
  onTranslateVocabButtonClick: null,
  onSubmitVocabButtonClick: null,
  onSourceLanguageChange: null,
  onTargetLanguageChange: null,
  onSourceLanguageDataListClick: null,
  onTargetLanguageDataListClick: null,
  isEditMode: false,
};

VocabForm.propTypes = {
  id: string.isRequired,
  form: object.isRequired,
  onSourceLanguageChange: func,
  onTargetLanguageChange: func,
  onSourceLanguageDataListClick: func,
  onTargetLanguageDataListClick: func,
  isEditMode: bool,
  onTranslateVocabButtonClick: func,
  onSubmitVocabButtonClick: func,
};

export default VocabForm;
