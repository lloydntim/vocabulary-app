
// import React from 'react';
import { STATUS, EVENTS, ACTIONS } from 'react-joyride';

import locale from './joyrideLocale';
import styles from './joyrideStyling';

const steps = (t) => [
  {
    title: t('vocablist_joyride_title_home'),
    target: '.sub-header .icon',
    disableBeacon: true,
    content: t('vocablist_joyride_content_home'),
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_addVocab'),
    target: '.icon-type-plus',
    spotlightClicks: true,
    content: t('vocablist_joyride_content_addVocab'),
    disableOverlayClose: true,
    hideCloseButton: true,
    hideFooter: true,
  },
  {
    title: t('vocablist_joyride_title_createVocab'),
    target: '.overlay.is-visible .tab-title:nth-of-type(1)',
    content: t('vocablist_joyride_content_createVocab'),
    disableBeacon: true,
    hideCloseButton: true,
    hideBackButton: true,
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_uploadVocabList'),
    target: '.overlay.is-visible .tab-title:nth-of-type(2)',
    content: t('vocablist_joyride_content_uploadVocabList'),
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_createVocabIntro'),
    target: '.overlay.is-visible .tab-title:nth-of-type(1)',
    content: t('vocablist_joyride_content_createVocabIntro'),
    display: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    hideBackButton: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_selectSourceLanguage'),
    target: '.overlay.is-visible input[name=sourceLanguage]',
    content: t('vocablist_joyride_content_selectSourceLanguage'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_enterSourceText'),
    target: '.overlay.is-visible input[name=sourceText]',
    content: t('vocablist_joyride_content_enterSourceText'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_selectTargetLanguage'),
    target: '.overlay.is-visible input[name=targetLanguage]',
    content: t('vocablist_joyride_content_selectTargetLanguage'),
    spotlightClicks: true,
    // disableBeacon: true,
    // spotlightPadding: 40,
    showSkipButton: false,
    disableOverlayClose: true,
    event: 'click',
    offset: 0,
    placement: 'top',
  },
  {
    title: t('vocablist_joyride_title_selectTargetText'),
    target: '.overlay.is-visible input[name=targetText]',
    content: t('vocablist_joyride_content_selectTargetText'),
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_translatetText'),
    target: '.overlay.is-visible .button:nth-of-type(1)',
    content: t('vocablist_joyride_content_translateText'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_createVocabButton'),
    target: '.overlay.is-visible .button:nth-of-type(2)',
    content: t('vocablist_joyride_content_createVocabButton'),
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: false,
    styles: { buttonNext: { display: 'none' } },
  },
  {
    title: t('vocablist_joyride_title_newVocabCreated'),
    target: '.list .list-item:nth-of-type(1)',
    content: t('vocablist_joyride_content_newVocabCreated'),
    spotlightClicks: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_selectVocabEntry'),
    target: '.checkbox-container',
    content: t('vocablist_joyride_content_selectVocabEntry'),
    spotlightClicks: true,
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_editVocabEntry'),
    target: '.icon-type-edit',
    content: t('vocablist_joyride_content_editVocabEntry'),
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_deleteVocabEntries'),
    target: '.icon-type-delete',
    content: t('vocablist_joyride_content_deleteVocabEntries'),
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_createVocabList'),
    target: '.icon-type-add-list',
    content: t('vocablist_joyride_content_createVocabList'),
    showSkipButton: false,
  },
  {
    title: t('vocablist_joyride_title_enterPlayMode'),
    target: '.sub-header .switch',
    content: t('vocablist_joyride_content_enterPlayMode'),
    disableOverlayClose: true,
    showSkipButton: false,
  },
];

const callback = (props) => (data) => {
  const { index, status, type, action } = data;
  const { run, updateJoyride, username } = props;
  const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

  if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    updateJoyride({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    if (index === 8 && action === ACTIONS.NEXT) {
      updateJoyride({ run: true, stepIndex: 10 });
    /* eslint-disable no-undef */
    // localStorage.setItem(`isVocablistEditModeJoyrideFinished-${username}`, true);
    // } else if (index === 21) {
    }
  } else if (finishedStatuses.includes(status)) {
    /* eslint-disable no-undef */
    updateJoyride({ run: !run, stepIndex: 0 });
    localStorage.setItem(`isVocablistEditModeJoyrideFinished-${username}`, true);
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
