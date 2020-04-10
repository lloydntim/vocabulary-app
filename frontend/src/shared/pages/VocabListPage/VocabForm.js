import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { func, bool, object, string } from 'prop-types';

import { Input, Button } from '../../components';

const VocabForm = ({
  id,
  form,
  translatedText,
  setTranslatedText,
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

  if (!isEditMode) {
    useEffect(() => {
      /* eslint-disable no-undef */
      const sourceLanguageCookieKey = `source-language-${id}`;
      const targetLanguageCookieKey = `target-language-${id}`;

      if (typeof Cookies.get(sourceLanguageCookieKey) === 'undefined') {
        Cookies.set(sourceLanguageCookieKey, i18n.language.substr(0, 2));
      }

      if (typeof Cookies.get(targetLanguageCookieKey) === 'undefined') {
        Cookies.set(targetLanguageCookieKey, '');
      }

      const [sourceLanguage] = languages.filter(({ value }) => value === Cookies.get(sourceLanguageCookieKey));
      console.log('sourceLanguage', Cookies.get(sourceLanguageCookieKey));
      const targetLanguage = !Cookies.get(targetLanguageCookieKey) ? '' : languages.filter(({ value }) => value === Cookies.get(targetLanguageCookieKey))[0].text;

      setInitFormData({ sourceLanguage: sourceLanguage.text, targetLanguage });
    }, []);
  }

  return (
    <form>
      <Input
        inputRef={sourceLanguage.ref}
        value={sourceLanguage.value}
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
        label={t('vocablist_form_label_sourceText')}
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
        inputRef={targetLanguage.ref}
        value={targetLanguage.value}
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
      <Input
        label={t('vocablist_form_label_targetText')}
        inputRef={targetText.ref}
        autoComplete="off"
        name={targetText.name}
        placeholder={t('vocablist_form_placeholder_targetText')}
        value={translatedText}
        onChange={({ value }) => setTranslatedText(value)}
        onBlur={({ value }) => setTranslatedText(value)}
      />
      {!isEditMode && (
        <Button
          type="tertiary"
          text={t('common_button_translate')}
          onClick={() => {
            // console.log('slCookie', Cookies.get(`source-language-${id}`));
            // console.log('tlCookie', Cookies.get(`target-language-${id}`));
            onTranslateVocabButtonClick({
              sourceLanguageCode: Cookies.get(`source-language-${id}`),
              targetLanguageCode: Cookies.get(`target-language-${id}`),
              sourceText: sourceText.value,
            });
          }}
        />
      )}
      <Button
        disabled={!isFormValid}
        type="secondary"
        text={t(`common_button_${isEditMode ? 'update' : 'create'}`)}
        onClick={() => onSubmitVocabButtonClick({
          sourceLanguage: sourceLanguage.value,
          targetLanguage: targetLanguage.value,
          sourceText: sourceText.value,
          targetText: translatedText,
        })}
      />
    </form>
  );
};
VocabForm.defaultProps = {
  onTranslateVocabButtonClick: null,
  onSourceLanguageChange: null,
  onTargetLanguageChange: null,
  onSourceLanguageDataListClick: null,
  onTargetLanguageDataListClick: null,
  isEditMode: false,
};

VocabForm.propTypes = {
  id: string.isRequired,
  form: object.isRequired,
  translatedText: string.isRequired,
  setTranslatedText: func.isRequired,
  onSourceLanguageChange: func,
  onTargetLanguageChange: func,
  onSourceLanguageDataListClick: func,
  onTargetLanguageDataListClick: func,
  isEditMode: bool,
  onTranslateVocabButtonClick: func,
  onSubmitVocabButtonClick: func.isRequired,
};

export default VocabForm;
