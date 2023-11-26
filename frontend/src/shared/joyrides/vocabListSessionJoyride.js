import React from 'react';
import { STATUS, EVENTS, ACTIONS } from 'react-joyride';

import locale from './joyrideLocale';
import styles from './joyrideStyling';

const steps = t => [
  {
    title: t('vocablist_joyride_title_playmodeIntro'),
    target: 'body',
    placement: 'center',
    content: (
      <>
        <h4>{t('vocablist_joyride_content_playmodeIntro')}</h4>
      </>
    ),
    disableBeacon: true,
    disableOverlayClose: true,
  },
  /*  {
    title: t('vocablist_joyride_title_playmodeSourceLanguage'),
    target: 'h5 > span:first-child',
    content: t('vocablist_joyride_content_playmodeSourceLanguage'),
  },
  {
    title: t('vocablist_joyride_title_playmodeTargetLanguage'),
    target: 'h5 > span:nth-of-type(3)',
    content: t('vocablist_joyride_content_playmodeTargetLanguage'),
  }, */
  {
    title: t('vocablist_joyride_title_playmodeSwapLanguages'),
    target: '.icon-type-swap',
    content: t('vocablist_joyride_content_playmodeSwapLanguages'),
    spotlightClicks: true,
  },
  /*   {
    title: t('vocablist_joyride_title_playmodeProgress'),
    target: 'small',
    content: t('vocablist_joyride_content_playmodeProgress'),
  },
  {
    title: t('vocablist_joyride_title_playmodeTargetTextField'),
    target: 'textarea',
    content: t('vocablist_joyride_content_playmodeTargetTextField'),
  },
  {
    title: t('vocablist_joyride_title_playmodeSubmitButton'),
    target: 'button.button.button-secondary',
    content: t('vocablist_joyride_content_playmodeSubmitButton'),

  }, */
  {
    title: t('vocablist_joyride_title_playmodeBackButtonText'),
    target: '.icon-type-backward',
    content: t('vocablist_joyride_content_playmodeBackButtonText'),
    spotlightClicks: true,
  },
  {
    title: t('vocablist_joyride_title_revealAnswer'),
    target: '.icon-type-view',
    content: t('vocablist_joyride_content_revealAnswer'),
  },
  {
    title: t('vocablist_joyride_title_refreshSession'),
    target: '.icon-type-refresh',
    content: t('vocablist_joyride_content_refreshSession'),
  },
  {
    title: t('vocablist_joyride_title_playmodeForwardButtonText'),
    target: '.icon-type-forward',
    content: t('vocablist_joyride_content_playmodeForwardButtonText'),
  },
];

const callback = props => data => {
  const { index, status, type, action } = data;
  const { run, updateJoyride, username } = props;
  const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

  if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    updateJoyride({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
  } else if (finishedStatuses.includes(status)) {
    /* eslint-disable no-undef */
    localStorage.setItem(
      `isVocablistPlayModeJoyrideFinished-${username}`,
      true,
    );
    updateJoyride({ run: !run, stepIndex: 0 });
  }
};

const vocabListsPageJoyride = {
  run: false,
  stepIndex: 0,
  steps,
  callback,
  styles,
  locale,
  showProgress: false,
};

export default vocabListsPageJoyride;
