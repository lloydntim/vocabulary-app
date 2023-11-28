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
  updateList,
  targetLang,
  sourceLang,
  onTranslateVocabButtonClick,
  onSubmitVocabButtonClick,
}) => {
  const {
    formData: { sourceLanguage, targetLanguage, sourceText, targetText },
    updateFormData,
    setInitFormData,
    isFormValid,
  } = form;
  const { t, i18n } = useTranslation();
  console.log('targetLang', targetLang);
  console.log('sourceLang', sourceLang);

  const languages = [
    { value: 'en', text: t('common_languages_english') },
    { value: 'de', text: t('common_languages_german') },
    { value: 'es', text: t('common_languages_spanish') },
    { value: 'fr', text: t('common_languages_french') },
    { value: 'pt', text: t('common_languages_portuguese') },
  ];

  const langMapper = {
    en: t('common_languages_english'),
    de: t('common_languages_german'),
    es: t('common_languages_spanish'),
    fr: t('common_languages_french'),
    pt: t('common_languages_portuguese'),
  };

  const sourceLanguageLabel = `vocablist_form_label_${
    isEditMode ? 'sourceLanguage' : 'translateFrom'
  }`;
  const sourceTextLabel = `vocablist_form_label_${
    isEditMode ? 'sourceText' : 'text'
  }`;
  const targetLanguageLabel = `vocablist_form_label_${
    isEditMode ? 'targetLanguage' : 'translateTo'
  }`;
  const targetTextLabel = `vocablist_form_label_${
    isEditMode ? 'targetText' : 'translation'
  }`;

  useEffect(() => {
    if (!isEditMode) {
      /* eslint-disable no-undef */
      const sourceLanguageCookieKey = `source-language-${id}`;
      const targetLanguageCookieKey = `target-language-${id}`;

      if (typeof Cookies.get(sourceLanguageCookieKey) === 'undefined') {
        Cookies.set(sourceLanguageCookieKey, i18n.language);
      }

      if (typeof Cookies.get(targetLanguageCookieKey) === 'undefined') {
        Cookies.set(targetLanguageCookieKey, '');
      }

      const [sourceLanguage] = languages.filter(
        ({ value }) =>
          value === Cookies.get(sourceLanguageCookieKey).substring(0, 2),
      );
      const targetLanguage = !Cookies.get(targetLanguageCookieKey)
        ? ''
        : languages.filter(
            ({ value }) => value === Cookies.get(targetLanguageCookieKey),
          )[0].text;
      setInitFormData({
        sourceLanguage: langMapper[sourceLang] || sourceLanguage.text,
        targetLanguage: langMapper[targetLang] || targetLanguage,
        sourceText: '',
      });

      // Makes sure input field is focused when both languages have been selected
      if (sourceLanguage && targetLanguage) {
        sourceText.ref.current.focus();
      }
    }
  }, []);

  return (
    <form
      className={`vocab-form ${isEditMode ? 'is-edit-mode' : 'is-add-mode'}`}
    >
      <Input
        label={t(sourceLanguageLabel)}
        inputRef={sourceLanguage.ref}
        tabIndex={isEditMode ? null : '1'}
        value={sourceLanguage.value}
        required
        requiredErrorMessage={t('messages_error_pleaseSelectLanguage')}
        placeholder={t('vocablist_form_placeholder_selectSourceLanguage')}
        autoComplete="off"
        name={sourceLanguage.name}
        disabled={isEditMode}
        dataList={languages}
        onChange={data => {
          updateFormData(data);
          if (onSourceLanguageChange) onSourceLanguageChange(data);
        }}
        onDataListClick={({ value }) => {
          Cookies.set(`source-language-${id}`, value);
          if (onSourceLanguageDataListClick)
            onSourceLanguageDataListClick({ value });
          updateList({ variables: { id, sourceLang: value } });
        }}
      />
      <Input
        label={t(sourceTextLabel)}
        inputRef={sourceText.ref}
        tabIndex={isEditMode ? null : '2'}
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
        tabIndex={isEditMode ? null : '1'}
        value={targetLanguage.value}
        required
        requiredErrorMessage={t('messages_error_pleaseSelectLanguage')}
        autoComplete="off"
        placeholder={t('vocablist_form_placeholder_selectTargetLanguage')}
        name={targetLanguage.name}
        dataList={languages}
        disabled={isEditMode}
        onChange={data => {
          updateFormData(data);
          if (onTargetLanguageChange) onTargetLanguageChange(data);
        }}
        onDataListClick={({ value }) => {
          Cookies.set(`target-language-${id}`, value);
          if (onTargetLanguageDataListClick)
            onTargetLanguageDataListClick({ value });
          console.log('value target lang', value);
          updateList({ variables: { id, targetLang: value } });
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
          rank="secondary"
          text={t('common_button_update')}
          onClick={() =>
            onSubmitVocabButtonClick({
              sourceLanguage: sourceLanguage.value,
              targetLanguage: targetLanguage.value,
              sourceText: sourceText.value,
              targetText: targetText.value,
            })
          }
        />
      ) : (
        <Button
          disabled={!isFormValid}
          rank="tertiary"
          tabIndex={isEditMode ? null : '2'}
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
  sourceLang: '',
  targetLang: '',
  updateList: null,
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
  updateList: func,
  sourceLang: string,
  targetLang: string,
  onSourceLanguageChange: func,
  onTargetLanguageChange: func,
  onSourceLanguageDataListClick: func,
  onTargetLanguageDataListClick: func,
  isEditMode: bool,
  onTranslateVocabButtonClick: func,
  onSubmitVocabButtonClick: func,
};

export default VocabForm;
