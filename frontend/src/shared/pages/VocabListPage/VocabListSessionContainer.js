import { string, func, arrayOf } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useStopwatch } from '../../hooks';

import VocabListSessionHeader from './VocabListSessionHeader';
import VocabListSessionBody from './VocabListSessionBody';
import VocabListSessionFooter from './VocabListSessionFooter';

const VocabListSessionContainer = ({ list, setJoyride }) => {
  const [count, setCount] = useState(0);
  const [isLanguageSwitched, toggleLanguage] = useState(false);
  const [translationInputValue, setTranslationInputValue] = useState('');
  const [attemptsNeeded, setAttemptsNeeded] = useState(0);
  const [hintsNeeded, setHintsNeeded] = useState(0);
  const [status, setStatusMessage] = useState('');
  const [reportData, setReportData] = useState({});
  const { time, reset } = useStopwatch();
  const currentVocab = list.length > 0 ? list[count] : [];
  const [langA, langB, textA, textB] = currentVocab;

  const sourceLanguage = !isLanguageSwitched ? langA : langB;
  const targetLanguage = !isLanguageSwitched ? langB : langA;
  const sourceText = !isLanguageSwitched ? textA : textB;
  const targetText = !isLanguageSwitched ? textB : textA;

  useEffect(() => {
    /* eslint-disable no-undef */
    const isVocablistPlayModeJoyrideFinished = localStorage.getItem('isVocablistPlayModeJoyrideFinished');
    if (isVocablistPlayModeJoyrideFinished === null) {
      setJoyride({ run: true, stepIndex: 17 });
      localStorage.setItem('isVocablistPlayModeJoyrideFinished', false);
    }
    if (isVocablistPlayModeJoyrideFinished === 'false') {
      setJoyride({ run: true, stepIndex: 17 });
    }
  }, []);

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
        vocabsReport={reportData}
        onVocabTranslationInputChange={(event) => {
          setTranslationInputValue(event.target.value);
          if (status) setStatusMessage('');
        }}
        onVocabTranslationInputFocus={() => {
          if (status) setStatusMessage('');
        }}
        onVocabTranslationSubmitButtonClick={() => {
          const statusMessage = targetText === translationInputValue.trim() ? 'success' : 'error';
          if (statusMessage === 'success') {
            const vocabResultData = {
              index: count,
              duration: time,
              textLength: targetText.length,
              attemptsNeeded,
              hintsNeeded,
            };
            const result = { ...reportData, ...{ [`vocab_${count}`]: vocabResultData } };
            setReportData(result);
          } else {
            setAttemptsNeeded(attemptsNeeded + 1);
          }
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

            reset();
            setHintsNeeded(0);
            setAttemptsNeeded(0);
          }
        }}
        onNextVocabButtonClick={() => {
          if (count < list.length - 1) {
            setCount(count + 1);
            setTranslationInputValue('');
            setStatusMessage('');

            reset();
            setHintsNeeded(0);
            setAttemptsNeeded(0);
          }
        }}
        onShowTranslationButtonActive={() => toggleLanguage(!isLanguageSwitched)}
        onShowTranslationButtonInactive={() => {
          setHintsNeeded(hintsNeeded + 1);
          toggleLanguage(!isLanguageSwitched);
        }}
        onRestartSessionButtonClick={() => {
          setTranslationInputValue('');
          setStatusMessage('');
          setCount(0);

          reset();
          setHintsNeeded(0);
          setAttemptsNeeded(0);
          setReportData({});
        }}
      />
    </>
  );
};

VocabListSessionContainer.propTypes = {
  list: arrayOf(arrayOf(string)).isRequired,
  setJoyride: func.isRequired,
};

export default VocabListSessionContainer;
