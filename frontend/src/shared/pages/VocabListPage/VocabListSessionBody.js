import React from 'react';
import {
  string,
  number,
  bool,
  func,
  object,
} from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Message } from '../../components';

const formattedTime = (time) => {
  const formatDigits = (value) => ((value < 10) ? `0${value}` : value);
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

/* eslint-disable react/jsx-props-no-spreading */
const VocabListSessionBody = ({
  vocabsTotalCount,
  currentVocab,
  vocabSourceText,
  vocabTranslationInputValue,
  isVocabTranslationCorrect,
  vocabTranslationStatusMessage,
  vocabsReport,
  onVocabTranslationInputChange,
  onVocabTranslationInputFocus,
  onVocabTranslationSubmitButtonClick,
}) => {
  const { t } = useTranslation();
  const sumArrayObjectProps = (array, prop) => array
    .map((object) => object[prop])
    .reduce((a, b) => a + b);

  const report = vocabsReport.vocab_1 ? Object.values(vocabsReport) : [];

  let totalAttempts = '';
  let totalHints = '';
  let totalTime = '';
  if (isVocabTranslationCorrect && (vocabsTotalCount === currentVocab)) {
    totalAttempts = sumArrayObjectProps(report, 'attemptsNeeded');
    totalHints = sumArrayObjectProps(report, 'hintsNeeded');
    totalTime = formattedTime(sumArrayObjectProps(report, 'duration')).getTime();
  }

  return (
    <>
      <small>{`${currentVocab} / ${vocabsTotalCount}`}</small>

      {(isVocabTranslationCorrect && (vocabsTotalCount === currentVocab))
        ? (
          <>
            <Message
              type="success"
              content={t('vocablist_message_sessionCompleted')}
            />
            <p>
              {t('vocablist_message_sessionTotalAttempts')}
              :
              {totalAttempts}
            </p>
            <p>
              {t('vocablist_message_sessionTotalHints')}
              :
              {totalHints}
            </p>
            <p>
              {t('vocablist_message_sessionTotalTime')}
              {totalTime}
              {t('vocablist_message_sessionTimeSeconds')}
            </p>
          </>
        ) : (
          <>
            <p>{vocabSourceText}</p>

            <label htmlFor="translation">
              <textarea
                id="translation"
                className={`message message-${vocabTranslationStatusMessage}`}
                rows="4"
                value={vocabTranslationInputValue}
                placeholder={t('vocablist_form_placeholder_enterTranslation')}
                onFocus={onVocabTranslationInputFocus}
                onChange={onVocabTranslationInputChange}
              />
            </label>

            <button
              className={`button button-secondary ${vocabTranslationInputValue < 1 ? 'is-disabled' : ''}`}
              disabled={vocabTranslationInputValue < 1}
              type="button"
              onClick={onVocabTranslationSubmitButtonClick}
            >
              {t('common_button_submit')}
            </button>
          </>
        )}
    </>
  );
};

VocabListSessionBody.propTypes = {
  vocabsTotalCount: number.isRequired,
  currentVocab: number.isRequired,
  vocabSourceText: string.isRequired,
  vocabTranslationInputValue: string.isRequired,
  isVocabTranslationCorrect: bool.isRequired,
  vocabTranslationStatusMessage: string.isRequired,
  vocabsReport: object.isRequired,
  onVocabTranslationInputChange: func.isRequired,
  onVocabTranslationInputFocus: func.isRequired,
  onVocabTranslationSubmitButtonClick: func.isRequired,
};

export default VocabListSessionBody;
