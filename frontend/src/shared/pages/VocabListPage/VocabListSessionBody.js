import React, { useRef, useEffect } from 'react';
import { string, number, bool, array, func, object } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Message, Icon, Button } from '../../components';

import VocabListSessionResults from './VocabListSessionResults';

const formatDigits = value => (value < 10 ? `0${value}` : value); // TODO: move to utils

const formattedTime = time => {
  const seconds = time % 60;
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 60 / 60);

  return {
    getTime: () =>
      `${formatDigits(hours)}:${formatDigits(minutes)}:${formatDigits(
        seconds,
      )}`,
    getHours: () => hours,
    getMinutes: () => minutes,
    getSeconds: () => seconds,
  };
};

/* eslint-disable react/jsx-props-no-spreading, no-undef,no-console,react/jsx-one-expression-per-line */
const VocabListSessionBody = ({
  id,
  results: resultList,
  updateList,
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
  const { t } = useTranslation();

  const translateTextArea = useRef();
  const sumArrayObjectProps = (array, prop) =>
    array.map(object => object[prop]).reduce((a, b) => Number(a + b), []);

  const report = vocabsReport.vocab_0 ? Object.values(vocabsReport) : [];

  useEffect(() => {
    /* eslint-disable no-undef */
    if (isVocabTranslationCorrect && vocabsTotalCount === currentVocab) {
      const totalAttempts = sumArrayObjectProps(report, 'attemptsNeeded');
      const totalHints = sumArrayObjectProps(report, 'hintsNeeded');
      const totalTime = formattedTime(
        sumArrayObjectProps(report, 'duration'),
      ).getTime();

      const finalResultsItem = {
        reports: report,
        totalCount: vocabsTotalCount,
        createdAt: Date.now(),
        totalAttempts,
        totalHints,
        totalTime,
      };

      updateList({
        variables: { id, results: [...resultList, finalResultsItem] },
      });
    }
  }, [currentVocab, isVocabTranslationCorrect]);

  useEffect(() => {
    if (translateTextArea.current && !vocabTranslationInputValue.length)
      translateTextArea.current.focus();
  }, [currentVocab, isVocabTranslationCorrect]);

  return (
    <>
      {isVocabTranslationCorrect && vocabsTotalCount === currentVocab ? (
        <>
          <Message
            type="success"
            content={t('vocablist_message_sessionCompleted')}
          />
          <VocabListSessionResults data={resultList} />
        </>
      ) : (
        <>
          <small>
            {`${t(
              'vocablist_sessionProgress',
            )}: ${currentVocab} / ${vocabsTotalCount}`}
          </small>
          <p className="source-text">{vocabSourceText}</p>

          {isTargetTextRevealed ? (
            <p className="target-text">
              <span>{vocabTargetText}</span>
              <Icon type="view" />
            </p>
          ) : (
            <label
              className={`textarea ${vocabTranslationStatusMessage &&
                `textarea-status-${vocabTranslationStatusMessage}`}`}
              htmlFor="translation"
            >
              <textarea
                id="translation"
                className="textarea-element"
                ref={translateTextArea}
                rows="3"
                value={vocabTranslationInputValue}
                placeholder={t('vocablist_form_placeholder_enterTranslation')}
                onFocus={onVocabTranslationInputFocus}
                onChange={onVocabTranslationInputChange}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onVocabTranslationSubmitButtonClick();
                  }
                }}
              />
              {vocabTranslationStatusMessage && (
                <Icon type={isVocabTranslationCorrect ? 'tick' : 'close'} />
              )}
            </label>
          )}

          <Button
            rank={`${isVocabTranslationCorrect ? 'tertiary' : 'secondary'}`}
            text={t(
              `common_button_${isVocabTranslationCorrect ? 'next' : 'submit'}`,
            )}
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
  results: array.isRequired,
  updateList: func.isRequired,
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
