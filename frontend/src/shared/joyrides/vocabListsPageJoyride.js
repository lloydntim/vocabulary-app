
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
    hideFooter: true,
  },
  // {
  //   title: t('vocablists_joyride_title_menu'),
  //   target: '.header .icon-type-menu',
  //   content: t('vocablists_joyride_content_menu'),
  //   spotlightClicks: false,
  //   disableBeacon: true,
  //   hideBackButton: true,
  //   // showSkipButton: false,
  // },
  {
    title: t('vocablists_joyride_title_createVocabList'),
    target: '.icon-type-plus',
    spotlightClicks: true,
    content: t('vocablists_joyride_content_createVocabList'),
    hideFooter: true,
  },
  /* {
    title: t('vocablists_joyride_title_enterTitle'),
    target: '.overlay.is-visible input',
    content: t('vocablists_joyride_content_enterTitle'),
    spotlightClicks: true,
    disableBeacon: true,
    placement: 'bottom',
    disableOverlayClose: true,
    hideBackButton: true,
    // showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_uploadFile'),
    target: '.overlay.is-visible input[type=file]',
    // spotlightClicks: true,
    content: t('vocablists_joyride_content_uploadFile'),
    disableOverlayClose: true,
    // showSkipButton: false,
  },
  {
    title: t('vocablists_joyride_title_addVocabList'),
    target: '.overlay.is-visible .button',
    content: t('vocablists_joyride_content_addVocabList'),
    spotlightClicks: true,
    disableOverlayClose: true,
    // showSkipButton: false,
    hideCloseButton: true,
    styles: { buttonNext: { display: 'none' } },
  },
  {
    title: t('vocablists_joyride_title_yourVocabList'),
    target: '.list .list-item:first-child',
    content: t('vocablists_joyride_content_yourVocabList'),
    hideFooter: true,
  },
 {
    title: t('vocablists_joyride_title_editVocabList'),
    target: '.list-item:first-child .icon-type-edit',
    content: t('vocablists_joyride_content_editVocabList'),
    disableBeacon: true,
  },
  {
    title: t('vocablists_joyride_title_deleteVocabList'),
    target: '.list-item:first-child .icon-type-delete',
    content: t('vocablists_joyride_content_deleteVocabList'),
    disableBeacon: true,
  }, */
];

const callback = (props) => (data) => {
  const { index, status, type, action } = data;
  const { username, run, updateJoyride } = props;
  const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

  if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    updateJoyride({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
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
