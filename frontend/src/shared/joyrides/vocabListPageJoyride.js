
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
  },
  {
    title: t('vocablist_joyride_title_enterPlayMode'),
    target: '.sub-header .switch',
    content: t('vocablist_joyride_content_enterPlayMode'),
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
  },
  {
    title: t('vocablist_joyride_title_uploadVocabList'),
    target: '.overlay.is-visible .tab-title:nth-of-type(2)',
    content: t('vocablist_joyride_content_uploadVocabList'),
  },
  {
    title: t('vocablist_joyride_title_createVocabIntro'),
    target: '.overlay.is-visible .tab-title:nth-of-type(1)',
    content: t('vocablist_joyride_content_createVocabIntro'),
    display: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
  },
  {
    title: t('vocablist_joyride_title_selectSourceLanguage'),
    target: '.overlay.is-visible input[name=sourceLanguage]',
    content: t('vocablist_joyride_content_selectSourceLanguage'),
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
  },
  {
    title: t('vocablist_joyride_title_selectSourceText'),
    target: '.overlay.is-visible input[name=sourceText]',
    content: t('vocablist_joyride_content_selectSourceText'),
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
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
  },
  {
    title: t('vocablist_joyride_title_selectTargetText'),
    target: '.overlay.is-visible input[name=targetText]',
    content: t('vocablist_joyride_content_selectTargetText'),
    disableBeacon: true,
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
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
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
  },
  {
    title: t('vocablist_joyride_title_createVocabList'),
    target: '.icon-type-add-list',
    content: t('vocablist_joyride_content_createVocabList'),
    hideNextButton: true,
  },
  // Play mode
  {
    title: t('vocablist_joyride_title_playmodeSwapLanguages'),
    target: '.icon-type-swap',
    content: t('vocablist_joyride_content_playmodeSwapLanguages'),
    spotlightClicks: true,
  },
  {
    title: t('vocablist_joyride_title_playmodeBackButtonText'),
    target: '.icon-type-backward',
    content: t('vocablist_joyride_content_playmodeBackButtonText'),
    spotlightClicks: true,
  },
  {
    title: t('vocablist_joyride_title_playmodeForwardButtonText'),
    target: '.icon-type-forward',
    content: t('vocablist_joyride_content_playmodeForwardButtonText'),
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
];

const callback = (props) => (data) => {
  const { index, status, type, action } = data;
  const { run, updateJoyride } = props;
  const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

  if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    updateJoyride({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });

    if (index === 15) {
      setTimeout(() => {
        updateJoyride({ stepIndex: 16, run: !run });
        /* eslint-disable no-undef */
        localStorage.setItem('isVocablistEditModeJoyrideFinished', true);
      }, 1500);
    } else if (index === 21) {
      localStorage.setItem('isVocablistPlayModeJoyrideFinished', true);
    }
  } else if (finishedStatuses.includes(status)) {
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
