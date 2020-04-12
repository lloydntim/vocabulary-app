import React from 'react';
import { func } from 'prop-types';
import { IconButton } from '../../components';

/* eslint-disable react/jsx-props-no-spreading */
const VocabListSessionFooter = ({
  onPreviousVocabButtonClick,
  onShowTranslationButtonActive,
  onShowTranslationButtonInactive,
  onRestartSessionButtonClick,
}) => (
  <>
    <ul>
      <li>
        <IconButton
          type="secondary"
          icon="backward"
          onClick={onPreviousVocabButtonClick}
        />
      </li>
      <li>
        <IconButton
          type="secondary"
          icon="view"
          onMouseDown={onShowTranslationButtonActive}
          onTouchStart={onShowTranslationButtonActive}
          onMouseUp={onShowTranslationButtonInactive}
          onTouchEnd={onShowTranslationButtonInactive}
        />
      </li>
      <li>
        <IconButton
          type="secondary"
          icon="refresh"
          onClick={onRestartSessionButtonClick}
        />
      </li>
    </ul>
  </>
);

VocabListSessionFooter.propTypes = {
  onPreviousVocabButtonClick: func.isRequired,
  onShowTranslationButtonActive: func.isRequired,
  onShowTranslationButtonInactive: func.isRequired,
  onRestartSessionButtonClick: func.isRequired,
};

export default VocabListSessionFooter;
