import React from 'react';
import { useTranslation } from 'react-i18next';
import { number, string, arrayOf, func } from 'prop-types';

import { IconButton, Checkbox } from '../../components';

const VocabListEditBody = ({
  list,
  selectedVocabs,
  onVocabCheckboxChange,
  onVocabSoundButtonClick,
  onVocabEditButtonClick,
}) => {
  const { t } = useTranslation();

  return (
    <ul className="vocabs-list list">
      {list.map((item, index) => {
        const [sourceLanguage, targetLanguage, sourceText, targetText] = item;

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

        const sourceLanguageTranslation = languageMap.filter((item, index) => item[index].indexOf(`${sourceLanguage.charAt(0).toUpperCase()}${sourceLanguage.slice(1)}`) !== -1);
        const sourceLanguageIndex = Object.keys(sourceLanguageTranslation[0]);
        const sourceLanguageText = languages[sourceLanguageIndex].text;

        const targetLanguageTranslation = languageMap.filter((item, index) => item[index].indexOf(`${targetLanguage.charAt(0).toUpperCase()}${targetLanguage.slice(1)}`) !== -1);
        const targetLanguageIndex = Object.keys(targetLanguageTranslation[0]);
        const targetLanguageText = languages[targetLanguageIndex].text;
        return (
          <li className="list-item" key={index}>
            <Checkbox
              name={`checkbox-${index + 1}`}
              checked={selectedVocabs.indexOf(index) !== -1}
              onChange={() => onVocabCheckboxChange(index, item)}
            />

            <div className="vocab-content">
              <small>{sourceLanguageText}</small>
              <span>
                {sourceText}
                <IconButton
                  rank="secondary"
                  type="sound"
                  onClick={() => onVocabSoundButtonClick(languages[sourceLanguageIndex].value, sourceText)}
                />
              </span>
              <small>{targetLanguageText}</small>
              <span>
                {targetText}
                <IconButton
                  rank="secondary"
                  type="sound"
                  onClick={() => onVocabSoundButtonClick(languages[targetLanguageIndex].value, targetText)}
                />
              </span>
            </div>

            <IconButton
              rank="secondary"
              type="edit"
              onClick={() => onVocabEditButtonClick(index, item)}
            />
          </li>
        );
      })}
    </ul>
  );
};

VocabListEditBody.propTypes = {
  list: arrayOf(arrayOf(string)).isRequired,
  selectedVocabs: arrayOf(number).isRequired,
  onVocabCheckboxChange: func.isRequired,
  onVocabSoundButtonClick: func.isRequired,
  onVocabEditButtonClick: func.isRequired,
};

export default VocabListEditBody;
