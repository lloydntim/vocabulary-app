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
      type="secondary"
      icon="delete"
      disabled={!selectedVocabs.length > 0}
      onClick={onDeleteVocabsButtonClick}
    />
    <IconButton
      icon="add-list"
      type="secondary"
      disabled={selectedVocabs.length < 2}
      onClick={onCreateNewVocabListButtonClick}
    />
    <IconButton
      icon="plus"
      type="secondary"
      onClick={onAddVocabButtonClick}
    />
  </div>
);

VocabListEditHeader.propTypes = {
  selectedVocabs: arrayOf(number).isRequired,
  onDeleteVocabsButtonClick: func.isRequired,
  onAddVocabButtonClick: func.isRequired,
  onCreateNewVocabListButtonClick: func.isRequired,
};

export default VocabListEditHeader;
