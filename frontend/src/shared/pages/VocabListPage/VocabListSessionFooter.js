import React from 'react';
import { bool, func } from 'prop-types';
import { IconButton } from '../../components';

/* eslint-disable react/jsx-props-no-spreading */
const VocabListSessionFooter = ({
  isNextVocabButtonDisabled,
  onPreviousVocabButtonClick,
  onNextVocabButtonClick,
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
      <li>
        <IconButton
          type="secondary"
          icon="forward"
          disabled={isNextVocabButtonDisabled}
          onClick={onNextVocabButtonClick}
        />
      </li>
    </ul>
  </>
);

VocabListSessionFooter.propTypes = {
  isNextVocabButtonDisabled: bool.isRequired,
  onPreviousVocabButtonClick: func.isRequired,
  onNextVocabButtonClick: func.isRequired,
  onShowTranslationButtonActive: func.isRequired,
  onShowTranslationButtonInactive: func.isRequired,
  onRestartSessionButtonClick: func.isRequired,
};

export default VocabListSessionFooter;
