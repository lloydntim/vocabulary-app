import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { string, arrayOf, object } from 'prop-types';
import Joyride from 'react-joyride';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';

import { useStopwatch } from '../../hooks';

import VocabListSessionHeader from './VocabListSessionHeader';
import VocabListSessionBody from './VocabListSessionBody';
import VocabListSessionFooter from './VocabListSessionFooter';

const capitalizeFirstLetter = (word) => {
  const trimmedWord = word.trim();
  return `${trimmedWord.substring(0, 1).toLocaleUpperCase()}${trimmedWord.substring(1, trimmedWord.length)}`;
};

const VocabListSessionContainer = ({ id, list, joyride }) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [isLanguageSwitched, toggleLanguage] = useState(false);
  const [isTargetTextRevealed, setIsTargetTextRevealed] = useState(false);
  const [translationInputValue, setTranslationInputValue] = useState('');
  const [attemptsNeeded, setAttemptsNeeded] = useState(0);
  const [hintsNeeded, setHintsNeeded] = useState(0);
  const [status, setStatusMessage] = useState('');
  const [reportData, setReportData] = useState({});
  const { time, reset } = useStopwatch();
  const currentCount = useMemo(() => count + 1, [count]);

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

  const onRestartSessionButtonClick = useCallback(
    () => {
      setTranslationInputValue('');
      setStatusMessage('');
      setCount(0);

      reset();
      setHintsNeeded(0);
      setAttemptsNeeded(0);
      setReportData({});
    },
    [count],
  );

  return (
    <>
      <Joyride
        steps={steps(t)}
        run={run}
        callback={callback({ username, run, updateJoyride })}
        stepIndex={stepIndex}
        styles={styles}
        locale={locale(t)}
        showProgress={false}
        continuous
        showSkipButton
      />
      <VocabListSessionHeader
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onToggleLanguageButtonClick={() => toggleLanguage(!isLanguageSwitched)}
      />
      <VocabListSessionBody
        id={id}
        vocabsTotalCount={list.length}
        currentVocab={currentCount}
        isTargetTextRevealed={isTargetTextRevealed}
        vocabSourceText={sourceText}
        vocabTargetText={targetText}
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
          setIsTargetTextRevealed(false);
        }}
        onVocabTranslationSubmitButtonClick={() => {
          if (status !== 'success') {
            const statusMessage = capitalizeFirstLetter(targetText) === capitalizeFirstLetter(translationInputValue) ? 'success' : 'error';

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
          } else if (count < list.length - 1) {
            setCount(count + 1);
            setTranslationInputValue('');
            setStatusMessage('');

            reset();
            setHintsNeeded(0);
            setAttemptsNeeded(0);
          }
        }}
      />

      <VocabListSessionFooter
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
        onShowTranslationButtonActive={() => setIsTargetTextRevealed(true)}
        onShowTranslationButtonInactive={() => {
          setHintsNeeded(hintsNeeded + 1);
          setIsTargetTextRevealed(false);
        }}
        onRestartSessionButtonClick={onRestartSessionButtonClick}
      />
    </>
  );
};

VocabListSessionContainer.propTypes = {
  id: string.isRequired,
  list: arrayOf(arrayOf(string)).isRequired,
  joyride: object.isRequired,
};

export default VocabListSessionContainer;
