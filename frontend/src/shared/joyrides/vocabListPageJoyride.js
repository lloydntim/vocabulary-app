
// import React from 'react';
import { /* STATUS,  ACTIONS, */ EVENTS } from 'react-joyride';

import locale from './joyrideLocale';
import styles from './joyrideStyling';

const steps = (t) => [
  {
    title: t('vocablist_joyride_title_addVocab'),
    target: '.icon-type-plus',
    spotlightClicks: true,
    content: t('vocablist_joyride_content_addVocab'),
    hideFooter: true,
    disableBeacon: true,
  },
  /* {
    title: t('vocablist_joyride_title_createVocab'),
    target: '.overlay.is-visible .tab-title:nth-of-type(1)',
    content: t('vocablist_joyride_content_createVocab'),
    disableBeacon: true,
    hideCloseButton: true,
    hideBackButton: true,
    disableOverlayClose: true,
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
  },
  {
    title: t('vocablist_joyride_title_selectSourceLanguage'),
    target: '.overlay.is-visible input[name=sourceLanguage]',
    content: t('vocablist_joyride_content_selectSourceLanguage'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    title: t('vocablist_joyride_title_enterSourceText'),
    target: '.overlay.is-visible input[name=sourceText]',
    content: t('vocablist_joyride_content_enterSourceText'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
  },
  {
    title: t('vocablist_joyride_title_selectTargetLanguage'),
    target: '.overlay.is-visible input[name=targetLanguage]',
    content: t('vocablist_joyride_content_selectTargetLanguage'),
    spotlightClicks: true,
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
  },
  {
    title: t('vocablist_joyride_title_translatetText'),
    target: '.overlay.is-visible .button:nth-of-type(1)',
    content: t('vocablist_joyride_content_translateText'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
  },
  {
    title: t('vocablist_joyride_title_createVocabButton'),
    target: '.overlay.is-visible .button:nth-of-type(2)',
    content: t('vocablist_joyride_content_createVocabButton'),
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    styles: { buttonNext: { display: 'none' } },
  },
  {
    title: t('vocablist_joyride_title_newVocabCreated'),
    target: '.list .list-item:nth-of-type(1)',
    content: t('vocablist_joyride_content_newVocabCreated'),
    spotlightClicks: true,
  },
  {
    title: t('vocablist_joyride_title_selectVocabEntry'),
    target: '.checkbox-container',
    content: t('vocablist_joyride_content_selectVocabEntry'),
    spotlightClicks: true,
  },
  {
    title: t('vocablist_joyride_title_editVocabEntry'),
    target: '.icon-type-edit',
    content: t('vocablist_joyride_content_editVocabEntry'),
  },
  {
    title: t('vocablist_joyride_title_deleteVocabEntries'),
    target: '.icon-type-delete',
    content: t('vocablist_joyride_content_deleteVocabEntries'),
  },*/
  {
    title: t('vocablist_joyride_title_enterPlayMode'),
    target: '.sub-header .switch',
    content: t('vocablist_joyride_content_enterPlayMode'),
    hideFooter: true,
  },
  {
    title: t('vocablist_joyride_title_uploadVocabList'),
    target: '.overlay.is-visible .tab-title:nth-of-type(2)',
    content: t('vocablist_joyride_content_uploadVocabList'),
    hideFooter: true,
  },
  {
    title: t('vocablist_joyride_title_createVocabList'),
    target: '.overlay.is-visible',
    placement: 'bottom',
    content: t('vocablist_joyride_content_createVocabList'),
    hideFooter: true,
  },
];

const callback = (props) => (data) => {
  const { index, type /* status, action  */ } = data;
  const { /* run,  */updateJoyride, username } = props;
  // const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
  console.log(data);
  /* eslint-disable no-undef */
  if (JSON.parse(localStorage.getItem(`isVocablistEditModeJoyrideProgress-${username}`).indexOf(index) !== -1)) {
    console.log('works', 0);
    updateJoyride({ run: false });
  } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    const progress = localStorage.getItem(`isVocablistEditModeJoyrideProgress-${username}`);
    const stepsList = progress ? JSON.parse(progress) : [];
    localStorage.setItem(`isVocablistEditModeJoyrideProgress-${username}`, JSON.stringify(stepsList.concat(index)));
    console.log('should work');
    updateJoyride({ stepIndex: 0, run: true });
  }

  // if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
  //   const progress = localStorage.getItem(`isVocablistEditModeJoyrideProgress-${username}`);
  //   const stepsList = progress ? JSON.parse(progress) : [];
  //   if (stepsList.indexOf(index) === -1) {
  //     updateJoyride({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1), run: true });
  //     localStorage.setItem(`isVocablistEditModeJoyrideProgress-${username}`, JSON.stringify(stepsList.concat(index)));
  //   }
  //   if (index === 0 && (action === ACTIONS.NEXT || action === ACTIONS.CLOSE)) {
  //     updateJoyride({ run: false, stepIndex: 0 });
  //   } else if (index === 1 && (action === ACTIONS.NEXT || action === ACTIONS.CLOSE)) {
  //     updateJoyride({ run: false, stepIndex: 1 });
  //   } else if (index === 3 && (action === ACTIONS.NEXT || action === ACTIONS.CLOSE)) {
  //     console.log('why');
  //     updateJoyride({ run: false, stepIndex: 3 });
  //   }
  // } else if (finishedStatuses.includes(status)) {
  //   updateJoyride({ run: !run, stepIndex: 0 });
  //   localStorage.setItem(`isVocablistEditModeJoyrideFinished-${username}`, true);
  // }
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
