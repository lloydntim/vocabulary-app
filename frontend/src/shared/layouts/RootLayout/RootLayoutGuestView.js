import React, { useState } from 'react';
import { oneOfType, arrayOf, node } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { IconButton, Logo, Radios } from '../../components';
import Dialog from '../Dialog/Dialog';

const useLanguageSelector = (languageData = []) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.substring(0, 2);
  const languages = languageData.map(({ value }) => value);
  const currentLanguageIndex = languages.indexOf(currentLanguage);
  const initLanguageIndex = currentLanguageIndex !== -1 ? currentLanguageIndex : 0;
  const [languageIndex, setLanguageIndex] = useState(initLanguageIndex);

  return {
    languageIndex,
    setLanguageIndex,
    language: languages[languageIndex],
    changeLanguage: (lang) => i18n.changeLanguage(lang),
  };
};

/* eslint-disable react/jsx-props-no-spreading */
const RootLayoutGuestView = ({ children }) => {
  const { t } = useTranslation();
  const languageData = [
    { value: 'en', label: t('common_languages_english') },
    { value: 'de', label: t('common_languages_german') },
    { value: 'es', label: t('common_languages_spanish') },
    { value: 'pt', label: t('common_languages_portuguese') },
    { value: 'pt', label: t('common_languages_french') },
  ];
  const {
    language,
    languageIndex,
    setLanguageIndex,
    changeLanguage,
  } = useLanguageSelector(languageData);
  const [isDialogVisible, setDialogVisibility] = useState(false);
  return (
    <>
      <div className="language-selector">
        <Dialog
          title={t('languageSelector_dialog_title_pleaseChooseLanguage')}
          isVisible={isDialogVisible}
          continueButtonText={t('common_button_select')}
          onCancelButtonClick={() => setDialogVisibility(false)}
          onContinueButtonClick={() => {
            changeLanguage(language);
            setDialogVisibility(false);
          }}
        >
          <Radios
            items={languageData}
            selectedItem={languageIndex}
            onChange={({ index }) => setLanguageIndex(index)}
          />
        </Dialog>
        <IconButton
          icon="language"
          type="primary"
          onClick={() => setDialogVisibility(true)}
        />
        <p className="language-selector-indicator">{language.toUpperCase()}</p>
      </div>
      <Logo />

      {children}

    </>
  );
};

RootLayoutGuestView.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
};

export default RootLayoutGuestView;
