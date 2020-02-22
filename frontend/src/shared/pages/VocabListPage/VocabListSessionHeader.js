import React from 'react';
import { string, func } from 'prop-types';

import { IconButton } from '../../components';

/* eslint-disable react/jsx-props-no-spreading */
const VocabListSessionHeader = ({
  sourceLanguage,
  targetLanguage,
  onToggleLanguageButtonClick,
}) => (
  <h5>
    <span>{sourceLanguage}</span>
    <span>
      <IconButton
        type="secondary"
        icon="swap"
        onClick={onToggleLanguageButtonClick}
      />
    </span>
    <span>{targetLanguage}</span>
  </h5>
);

VocabListSessionHeader.propTypes = {
  sourceLanguage: string.isRequired,
  targetLanguage: string.isRequired,
  onToggleLanguageButtonClick: func.isRequired,
};

export default VocabListSessionHeader;
