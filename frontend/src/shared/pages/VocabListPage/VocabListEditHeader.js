import React from 'react';
import { number, arrayOf, func } from 'prop-types';

import { IconButton } from '../../components';

const VocabListEditHeader = ({
  selectedVocabs,
  onDeleteVocabsButtonClick,
  onCreateNewVocabListButtonClick,
  onAddVocabButtonClick,
}) => (
  <div className="header">
    <IconButton
      icon="plus"
      type="secondary"
      onClick={onAddVocabButtonClick}
    />
    {selectedVocabs.length > 0
    && (
      <>
        <IconButton
          icon="add-list"
          type="secondary"
          onClick={onCreateNewVocabListButtonClick}
        />
        <IconButton
          type="secondary"
          icon="delete"
          onClick={onDeleteVocabsButtonClick}
        />
      </>
    )}
  </div>
);

VocabListEditHeader.propTypes = {
  selectedVocabs: arrayOf(number).isRequired,
  onDeleteVocabsButtonClick: func.isRequired,
  onAddVocabButtonClick: func.isRequired,
  onCreateNewVocabListButtonClick: func.isRequired,
};

export default VocabListEditHeader;
