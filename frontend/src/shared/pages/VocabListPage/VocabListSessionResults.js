import React, { useState, useMemo, useEffect } from 'react';
import { array } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Button } from '../../components';

const formatDigits = value => (value < 10 ? `0${value}` : value); // TODO: move to utils

/* eslint-disable react/jsx-props-no-spreading,react/jsx-one-expression-per-line */
const VocabListSessionResults = ({ data }) => {
  if (!data.length) {
    return false;
  }

  const { t } = useTranslation();
  const [currentResultsListIndex, setCurrentResultsIndexList] = useState(
    data.length - 1,
  );
  const currentResult = useMemo(() => data[currentResultsListIndex], [
    currentResultsListIndex,
  ]);
  const {
    totalCount,
    totalAttempts,
    totalHints,
    totalTime,
    createdAt,
  } = currentResult;
  useEffect(() => {
    setCurrentResultsIndexList(data.length - 1);
  }, [data]);
  const finishDate = `${formatDigits(
    new Date(createdAt).getDate(),
  )}/${formatDigits(
    new Date(createdAt).getMonth() + 1,
  )}/${new Date().getFullYear()}`;
  const finishTime = `${formatDigits(new Date().getHours())}:${formatDigits(
    new Date(createdAt).getMinutes(),
  )}`;
  return (
    <>
      <h2 className="results-title">{t('vocablist_title_sessionResults')}</h2>
      <div className="container">
        <div>{t('vocablist_message_sessionTotalVocabs')}:</div>
        <div>{totalCount}</div>

        <div>{t('vocablist_message_sessionTotalAttempts')}:</div>
        <div>{totalAttempts}</div>

        <div>{t('vocablist_message_sessionTotalHints')}:</div>
        <div>{totalHints}</div>

        <div>{t('vocablist_message_sessionTotalTime')}:</div>
        <div>
          {totalTime}
          &nbsp;
          {t('vocablist_message_sessionTimeSeconds')}
        </div>

        <div>{t('vocablist_message_sessionFinishDate')}:</div>
        <div>{finishDate}</div>

        <div>{t('vocablist_message_sessionFinishTime')}:</div>
        <div>{finishTime}</div>
      </div>

      <div
        className={`results-controls ${
          currentResultsListIndex === 0 ? 'is-justify-right' : ''
        }`}
      >
        {currentResultsListIndex !== 0 && (
          <Button
            rank="tertiary"
            onClick={() => {
              if (currentResultsListIndex > 0)
                setCurrentResultsIndexList(currentResultsListIndex - 1);
            }}
            text={t('vocablist_button_sessionPreviousResults')}
          />
        )}
        {currentResultsListIndex !== data.length - 1 && (
          <Button
            rank="tertiary"
            onClick={() => {
              if (currentResultsListIndex < data.length - 1)
                setCurrentResultsIndexList(currentResultsListIndex + 1);
            }}
            text={t('vocablist_button_sessionNextResults')}
          />
        )}
      </div>
    </>
  );
};

VocabListSessionResults.propTypes = {
  data: array.isRequired,
};

export default VocabListSessionResults;
