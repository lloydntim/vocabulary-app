import React from 'react';
import {
  string,
  number,
  bool,
  func,
  object,
} from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Message, Icon, Button } from '../../components';

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
  const sumArrayObjectProps = (array, prop) => array
    .map((object) => object[prop])
    .reduce((a, b) => Number(a + b), []);

  const report = vocabsReport.vocab_0 ? Object.values(vocabsReport) : [];

  let totalAttempts = 0;
  let totalHints = 0;
  let totalTime = 0;
  if (isVocabTranslationCorrect && (vocabsTotalCount === currentVocab)) {
    totalAttempts = sumArrayObjectProps(report, 'attemptsNeeded');
    totalHints = sumArrayObjectProps(report, 'hintsNeeded');
    totalTime = formattedTime(sumArrayObjectProps(report, 'duration')).getTime();
  }

  return (
    <>
      {(isVocabTranslationCorrect && (vocabsTotalCount === currentVocab))
        ? (
          <>
            <Message
              type="success"
              content={t('vocablist_message_sessionCompleted')}
            />
            <h2 className="results-title">{t('vocablist_title_sessionResults')}</h2>
            <div className="container">
              <div>
                {t('vocablist_message_sessionTotalAttempts')}
                :
              </div>
              <div>
                {totalAttempts}
              </div>

              <div>
                {t('vocablist_message_sessionTotalHints')}
                :
              </div>
              <div>
                {totalHints}
              </div>

              <div>
                {t('vocablist_message_sessionTotalTime')}
                :
              </div>
              <div>
                {totalTime}
                &nbsp;
                {t('vocablist_message_sessionTimeSeconds')}
              </div>
            </div>
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
