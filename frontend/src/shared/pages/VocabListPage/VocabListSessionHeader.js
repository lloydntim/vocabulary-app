import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { string, func } from 'prop-types';

import { IconButton } from '../../components';

/* eslint-disable react/jsx-props-no-spreading */
const VocabListSessionHeader = ({
  sourceLanguage,
  targetLanguage,
  onToggleLanguageButtonClick,
}) => {
  const { t } = useTranslation();
  const [sessionLanguages, setSessionLanguages] = useState({ sourceLanguage, targetLanguage });
  const languages = [
    { value: 'en', text: t('common_languages_english') },
    { value: 'de', text: t('common_languages_german') },
    { value: 'es', text: t('common_languages_spanish') },
    { value: 'fr', text: t('common_languages_french') },
    { value: 'pt', text: t('common_languages_portuguese') },
  ];
  const languageMap = [
    { 0: ['English', 'Englisch', 'Inglés', 'Anglais', 'Inglês'] },
    { 1: ['German', 'Deutsch', 'Alemán', 'Allemand', 'Alemão'] },
    { 2: ['Spanish', 'Spanisch', 'Español', 'Espagnol', 'Espanhol'] },
    { 3: ['French', 'Französisch', 'Français', 'Francés', 'Francês'] },
    { 4: ['Portuguese', 'Portugiesisch', 'Portugais', 'Portugués', 'Português'] },
  ];

  useEffect(() => {
    const sourceLanguageTranslation = languageMap.filter((item, index) => item[index].indexOf(`${sourceLanguage.charAt(0).toUpperCase()}${sourceLanguage.slice(1)}`) !== -1);
    const sourceLanguageIndex = Object.keys(sourceLanguageTranslation[0]);
    const sourceLanguageText = languages[sourceLanguageIndex].text;

    const targetLanguageTranslation = languageMap.filter((item, index) => item[index].indexOf(`${targetLanguage.charAt(0).toUpperCase()}${targetLanguage.slice(1)}`) !== -1);
    const targetLanguageIndex = Object.keys(targetLanguageTranslation[0]);
    const targetLanguageText = languages[targetLanguageIndex].text;
    setSessionLanguages({ sourceLanguage: sourceLanguageText, targetLanguage: targetLanguageText });
  }, []);

  return (
    <h5>
      <span>{sessionLanguages.sourceLanguage}</span>
      <span>
        <IconButton
          type="secondary"
          icon="swap"
          onClick={onToggleLanguageButtonClick}
        />
      </span>
      <span>{sessionLanguages.targetLanguage}</span>
    </h5>
  );
};
VocabListSessionHeader.propTypes = {
  sourceLanguage: string.isRequired,
  targetLanguage: string.isRequired,
  onToggleLanguageButtonClick: func.isRequired,
};

export default VocabListSessionHeader;
