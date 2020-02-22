import React, { useState } from 'react';
import { string, arrayOf /* , func  */ } from 'prop-types';

import VocabListSessionHeader from './VocabListSessionHeader';
import VocabListSessionBody from './VocabListSessionBody';
import VocabListSessionFooter from './VocabListSessionFooter';

const VocabListSessionContainer = ({ list }) => {
  const [count, setCount] = useState(0);
  const [isLanguageSwitched, toggleLanguage] = useState(false);
  const [translationInputValue, setTranslationInputValue] = useState('');
  const [status, setStatusMessage] = useState('');
  const currentVocab = list.length > 0 ? list[count] : [];
  const [langA, langB, textA, textB] = currentVocab;

  const sourceLanguage = isLanguageSwitched ? langA : langB;
  const targetLanguage = isLanguageSwitched ? langB : langA;
  const sourceText = isLanguageSwitched ? textA : textB;
  const targetText = isLanguageSwitched ? textB : textA;

  return (
    <>
      <VocabListSessionHeader
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onToggleLanguageButtonClick={() => toggleLanguage(!isLanguageSwitched)}
      />
      <VocabListSessionBody
        vocabsTotalCount={list.length}
        currentVocab={count + 1}
        vocabSourceText={sourceText}
        isVocabTranslationCorrect={status === 'success'}
        vocabTranslationInputValue={translationInputValue}
        vocabTranslationStatusMessage={status}
        onVocabTranslationInputChange={(event) => {
          setTranslationInputValue(event.target.value);
          if (status) setStatusMessage('');
        }}
        onVocabTranslationInputFocus={() => {
          if (status) setStatusMessage('');
        }}
        onVocabTranslationSubmitButtonClick={() => {
          const statusMessage = targetText === translationInputValue ? 'success' : 'error';
          setStatusMessage(statusMessage);
        }}
      />

      <VocabListSessionFooter
        isNextVocabButtonDisabled={status !== 'success'}
        onPreviousVocabButtonClick={() => {
          if (count > 0) {
            setCount(count - 1);
            setTranslationInputValue('');
            setStatusMessage('');
          }
        }}
        onNextVocabButtonClick={() => {
          if (count < list.length - 1) {
            setCount(count + 1);
            setTranslationInputValue('');
            setStatusMessage('');
          }
        }}
        onShowTranslationButtonActive={() => toggleLanguage(!isLanguageSwitched)}
        onShowTranslationButtonInactive={() => toggleLanguage(!isLanguageSwitched)}
        onRestartSessionButtonClick={() => {
          setTranslationInputValue('');
          setStatusMessage('');
          setCount(0);
        }}
      />
    </>
  );
};

VocabListSessionContainer.propTypes = {
  list: arrayOf(arrayOf(string)).isRequired,
};

export default VocabListSessionContainer;
