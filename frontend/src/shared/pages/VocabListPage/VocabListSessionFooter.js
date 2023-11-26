import React from 'react';
import { func } from 'prop-types';
import { IconButton } from '../../components';

/* eslint-disable react/jsx-props-no-spreading, no-undef */
const VocabListSessionFooter = ({
  onPreviousVocabButtonClick,
  onShowTranslationButtonActive,
  onShowTranslationButtonInactive,
  onRestartSessionButtonClick,
}) => (
  <>
    <ul className="practice-mode-controls">
      <li>
        <IconButton
          rank="secondary"
          type="backward"
          onClick={onPreviousVocabButtonClick}
        />
      </li>
      <li>
        <IconButton
          rank="secondary"
          type="view"
          {...('ontouchstart' in window
            ? {
              onTouchStart: onShowTranslationButtonActive,
              onTouchEnd: onShowTranslationButtonInactive,
            }
            : {
              onMouseDown: onShowTranslationButtonActive,
              onMouseUp: onShowTranslationButtonInactive,
              onMouseLeave: onShowTranslationButtonInactive,
            })}
        />
      </li>
      <li>
        <IconButton
          rank="secondary"
          type="refresh"
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
