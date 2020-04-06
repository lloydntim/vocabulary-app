
import React from 'react';
import { STATUS, EVENTS, ACTIONS } from 'react-joyride';

import locale from './joyrideLocale';
import styles from './joyrideStyling';

const steps = (t) => [
  {
    title: t('vocablists_joyride_title_welcomeToVocapp'),
    target: 'body',
    placement: 'center',
    content: <div><h4>{t('vocablists_joyride_content_welcomeToVocapp')}</h4></div>,
    disableBeacon: true,
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_menu'),
    target: '.header .icon-type-menu',
    content: t('vocablists_joyride_content_menu'),
    spotlightClicks: false,
    disableBeacon: true,
    hideBackButton: true,
    showSkipButton: false,
    disableOverlayClose: true,
  },
  {
    title: t('vocablists_joyride_title_createVocabList'),
    target: '.icon-type-add-list',
    spotlightClicks: true,
    content: t('vocablists_joyride_content_createVocabList'),
    hideFooter: true,
    disableOverlayClose: true,
  },
  {
    title: t('vocablists_joyride_title_enterTitle'),
    target: '.overlay.is-visible input',
    content: t('vocablists_joyride_content_enterTitle'),
    spotlightClicks: true,
    disableOverlayClose: true,
    hideBackButton: true,
    showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_uploadFile'),
    target: '.overlay.is-visible input[type=file]',
    // spotlightClicks: true,
    content: t('vocablists_joyride_content_uploadFile'),
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_addVocabList'),
    target: '.overlay.is-visible .button',
    content: t('vocablists_joyride_content_addVocabList'),
    spotlightClicks: true,
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_yourVocabList'),
    target: '.list-item:first-child',
    content: t('vocablists_joyride_content_yourVocabList'),
    spotlightClicks: true,
    showSkipButton: false,
    hideBackButton: true,
  },
  {
    title: t('vocablists_joyride_title_editVocabList'),
    target: '.list-item:first-child .icon-type-edit',
    content: t('vocablists_joyride_content_editVocabList'),
    disableOverlayClose: true,
    showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_deleteVocabList'),
    target: '.list-item:first-child .icon-type-delete',
    content: t('vocablists_joyride_content_deleteVocabList'),
    disableOverlayClose: true,
    showSkipButton: false,
  },
];

const callback = (props) => (data) => {
  const { index, status, type, action } = data;
  const { isOverlayVisible, username, run, updateJoyride } = props;
  const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

  if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    updateJoyride({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });

    if (isOverlayVisible && index === 2) {
      setTimeout(() => updateJoyride({ run: true }), 400);
    } else if (isOverlayVisible && index === 3) {
      updateJoyride({ run: true, stepIndex: 4 });
    } else if (isOverlayVisible && index === 5) {
      updateJoyride({ run: true, stepIndex: index + (action === ACTIONS.PREV ? -1 : 0) });
    }
  } else if (finishedStatuses.includes(status)) {
    /* eslint-disable no-undef */
    localStorage.setItem(`isVocablistsJoyrideFinished-${username}`, true);
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
