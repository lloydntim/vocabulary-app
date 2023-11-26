import React, { forwardRef } from 'react';
import { number, arrayOf, func, bool } from 'prop-types';

import { IconButton } from '../../components';
/* eslint-disable no-undef */

const VocabListEditHeader = forwardRef(
  (
    {
      isSticky,
      selectedVocabs,
      onDeleteVocabsButtonClick,
      onCreateNewVocabListButtonClick,
      onAddVocabButtonClick,
      onCopyVocabsButtonClick,
      onCutVocabsButtonClick,
      onPasteVocabsButtonClick,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`header ${isSticky ? 'is-sticky' : ''}`}>
        <IconButton
          rank="secondary"
          type="delete"
          disabled={!selectedVocabs.length > 0}
          onClick={onDeleteVocabsButtonClick}
        />
        <IconButton
          type="add-list"
          rank="secondary"
          disabled={selectedVocabs.length < 2}
          onClick={onCreateNewVocabListButtonClick}
        />
        <IconButton
          type="copy"
          rank="secondary"
          disabled={selectedVocabs.length < 1}
          onClick={onCopyVocabsButtonClick}
        />
        <IconButton
          type="clipboard"
          rank="secondary"
          disabled={
            !JSON.parse(sessionStorage.getItem('clipboard') || '[]').length
          }
          onClick={onPasteVocabsButtonClick}
        />
        <IconButton
          type="move"
          rank="secondary"
          disabled={selectedVocabs.length < 1}
          onClick={onCutVocabsButtonClick}
        />
        <IconButton
          type="plus"
          rank="secondary"
          onClick={onAddVocabButtonClick}
        />
      </div>
    );
  },
);

VocabListEditHeader.propTypes = {
  isSticky: bool.isRequired,
  selectedVocabs: arrayOf(number).isRequired,
  onDeleteVocabsButtonClick: func.isRequired,
  onAddVocabButtonClick: func.isRequired,
  onCopyVocabsButtonClick: func.isRequired,
  onCutVocabsButtonClick: func.isRequired,
  onPasteVocabsButtonClick: func.isRequired,
  onCreateNewVocabListButtonClick: func.isRequired,
};

export default VocabListEditHeader;
