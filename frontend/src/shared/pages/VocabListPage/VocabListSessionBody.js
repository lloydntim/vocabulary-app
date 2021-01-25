import React, { useRef, useEffect, useState } from 'react';
import {
  string,
  number,
  bool,
  func,
  object,
} from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Message, Icon, Button } from '../../components';

import VocabListSessionResults from './VocabListSessionResults';

const formatDigits = (value) => ((value < 10) ? `0${value}` : value); // TODO: move to utils

const formattedTime = (time) => {
  const seconds = time % 60;
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor((time / 60) / 60);

  return {
    getTime: () => `${formatDigits(hours)}:${formatDigits(minutes)}:${formatDigits(seconds)}`,
    getHours: () => hours,
    getMinutes: () => minutes,
    getSeconds: () => seconds,
  };
};

/* eslint-disable react/jsx-props-no-spreading, no-undef */
const VocabListSessionBody = ({
  id,
  vocabsTotalCount,
  currentVocab,
  vocabSourceText,
  vocabTargetText,
  vocabTranslationInputValue,
  isTargetTextRevealed,
  isVocabTranslationCorrect,
  vocabTranslationStatusMessage,
  vocabsReport,
  onVocabTranslationInputChange,
  onVocabTranslationInputFocus,
  onVocabTranslationSubmitButtonClick,
}) => {
  const [resultsData, setResultsData] = useState([]);
  const { t } = useTranslation();

  const translateTextArea = useRef();
  const sumArrayObjectProps = (array, prop) => array
    .map((object) => object[prop])
    .reduce((a, b) => Number(a + b), []);

  const report = vocabsReport.vocab_0 ? Object.values(vocabsReport) : [];

  let totalAttempts = 0;
  let totalHints = 0;
  let totalTime = 0;
  let finishDateString = 0;
  let finishTimeString = 0;
  // const resultsListId = `results_${id}`;
  // let resultsList = 0;
  let results = {};

  useEffect(() => {
    /* eslint-disable no-undef */
    // resultsList = localStorage.getItem(resultsListId) !== null ? JSON.parse(localStorage.getItem(resultsListId)) : [];
    results = localStorage.getItem('resultsList') !== null ? JSON.parse(localStorage.getItem('resultsList')) : { [id]: [] };
    if (isVocabTranslationCorrect && (vocabsTotalCount === currentVocab)) {
      totalAttempts = sumArrayObjectProps(report, 'attemptsNeeded');
      totalHints = sumArrayObjectProps(report, 'hintsNeeded');
      totalTime = formattedTime(sumArrayObjectProps(report, 'duration')).getTime();
      finishDateString = `${formatDigits(new Date().getDate())}/${(formatDigits(new Date().getMonth() + 1))}/${new Date().getFullYear()}`;
      finishTimeString = `${formatDigits(new Date().getHours())}:${formatDigits(new Date().getMinutes())}`;
      const finalResultsItem = {
        totalCount: vocabsTotalCount,
        listId: id,
        createdAt: Date.now(),
        totalAttempts,
        totalHints,
        totalTime,
        finishDate: finishDateString,
        finishTime: finishTimeString,
      };

      const newResultData = results[id] || [];
      const newResult = { [id]: [...newResultData, finalResultsItem] };
      localStorage.setItem('resultsList', JSON.stringify({ ...results, ...newResult }));
      setResultsData(newResult[id]);
      // localStorage.setItem(resultsListId, JSON.stringify([...resultsList, finalResultsItem]));
      // setResultsData([...resultsList, finalResultsItem]);
    }
  }, [currentVocab, isVocabTranslationCorrect]);

  useEffect(() => {
    if (translateTextArea.current && !vocabTranslationInputValue.length) translateTextArea.current.focus();
  }, [currentVocab, isVocabTranslationCorrect]);

  return (
    <>
      {(isVocabTranslationCorrect && (vocabsTotalCount === currentVocab))
        ? (
          <>
            <Message
              type="success"
              content={t('vocablist_message_sessionCompleted')}
            />
            <VocabListSessionResults data={resultsData} />
          </>
        ) : (
          <>
            <small>{`${t('vocablist_sessionProgress')}: ${currentVocab} / ${vocabsTotalCount}`}</small>
            <p className="source-text">{vocabSourceText}</p>

            {isTargetTextRevealed ? (
              <p className="target-text">
                <span>
                  {vocabTargetText}
                </span>
                <Icon type="view" />
              </p>
            ) : (
              <label className={`textarea ${vocabTranslationStatusMessage ? `textarea-status-${vocabTranslationStatusMessage}` : ''}`} htmlFor="translation">
                <textarea
                  id="translation"
                  className="textarea-element"
                  ref={translateTextArea}
                  rows="4"
                  value={vocabTranslationInputValue}
                  placeholder={t('vocablist_form_placeholder_enterTranslation')}
                  onFocus={onVocabTranslationInputFocus}
                  onChange={onVocabTranslationInputChange}
                />
                {vocabTranslationStatusMessage && <Icon type={isVocabTranslationCorrect ? 'tick' : 'close'} />}
              </label>
            )}

            <Button
              rank={`${isVocabTranslationCorrect ? 'tertiary' : 'secondary'}`}
              text={t(`common_button_${isVocabTranslationCorrect ? 'next' : 'submit'}`)}
              onClick={onVocabTranslationSubmitButtonClick}
              disabled={vocabTranslationInputValue.length === 0}
            />
          </>
        )}
    </>
  );
};

VocabListSessionBody.propTypes = {
  id: string.isRequired,
  vocabsTotalCount: number.isRequired,
  currentVocab: number.isRequired,
  vocabSourceText: string.isRequired,
  vocabTargetText: string.isRequired,
  vocabTranslationInputValue: string.isRequired,
  isVocabTranslationCorrect: bool.isRequired,
  isTargetTextRevealed: bool.isRequired,
  vocabTranslationStatusMessage: string.isRequired,
  vocabsReport: object.isRequired,
  onVocabTranslationInputChange: func.isRequired,
  onVocabTranslationInputFocus: func.isRequired,
  onVocabTranslationSubmitButtonClick: func.isRequired,
};

export default VocabListSessionBody;
