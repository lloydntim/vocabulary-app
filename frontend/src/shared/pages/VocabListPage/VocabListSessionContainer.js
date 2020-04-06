import React, { useState, useEffect } from 'react';
import { string, arrayOf, object } from 'prop-types';
import Joyride from 'react-joyride';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';

import { useStopwatch } from '../../hooks';

import VocabListSessionHeader from './VocabListSessionHeader';
import VocabListSessionBody from './VocabListSessionBody';
import VocabListSessionFooter from './VocabListSessionFooter';

const VocabListSessionContainer = ({ list, joyride }) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [isLanguageSwitched, toggleLanguage] = useState(false);
  const [translationInputValue, setTranslationInputValue] = useState('');
  const [attemptsNeeded, setAttemptsNeeded] = useState(0);
  const [hintsNeeded, setHintsNeeded] = useState(0);
  const [status, setStatusMessage] = useState('');
  const [reportData, setReportData] = useState({});
  const { time, reset } = useStopwatch();

  /* eslint-disable no-undef */
  const token = localStorage.getItem('token');
  const { username } = jwtDecode(token);

  const { run, stepIndex, steps, styles, callback, updateJoyride, locale } = joyride;
  const currentVocab = list.length > 0 ? list[count] : [];
  const [langA, langB, textA, textB] = currentVocab;

  const sourceLanguage = !isLanguageSwitched ? langA : langB;
  const targetLanguage = !isLanguageSwitched ? langB : langA;
  const sourceText = !isLanguageSwitched ? textA : textB;
  const targetText = !isLanguageSwitched ? textB : textA;

  // useEffect(() => {
  //   /* eslint-disable no-undef */
  //   const isVocablistPlayModeJoyrideFinished = localStorage.getItem('isVocablistPlayModeJoyrideFinished');
  //   if (isVocablistPlayModeJoyrideFinished === null) {
  //     setJoyride({ run: true, stepIndex: 17 });
  //     localStorage.setItem('isVocablistPlayModeJoyrideFinished', false);
  //   }
  //   if (isVocablistPlayModeJoyrideFinished === 'false') {
  //     setJoyride({ run: true, stepIndex: 17 });
  //   }
  // }, []);

  useEffect(() => {
    /* eslint-disable no-undef */
    const isVocablistPlayModeJoyrideFinishedKey = `isVocablistPlayModeJoyrideFinished-${username}`;
    const isVocablistPlayModeJoyrideFinished = localStorage.getItem(isVocablistPlayModeJoyrideFinishedKey);
    if (isVocablistPlayModeJoyrideFinished === null) {
      updateJoyride({ run: true, stepIndex });
      localStorage.setItem(isVocablistPlayModeJoyrideFinishedKey, false);
    }
    if (isVocablistPlayModeJoyrideFinished === 'false') {
      updateJoyride({ run: true, stepIndex });
    }
  }, []);

  return (
    <>
      <Joyride
        steps={steps(t)}
        run={run}
        callback={callback({ username, run, updateJoyride })}
        stepIndex={stepIndex}
        styles={styles}
        locale={locale(t)}
        showProgress
        continuous
        showSkipButton
      />
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
  joyride: object.isRequired,
};

export default VocabListSessionContainer;
