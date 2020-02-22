import React from 'react';
import { string, bool, func } from 'prop-types';

import { Overlay } from '../../layouts';

const VocabListItemEditOverlay = ({
  newTitle,
  isVisible,
  onNewTitleInputChange,
  onCloseButtonClick,
  onUpdateTitleButtonClick,
}) => (
  <Overlay
    isVisible={isVisible}
    onCloseButtonClick={onCloseButtonClick}
  >
    <h1>Vocab List Title</h1>

    <form>
      <label htmlFor="title">
        <span>Title</span>
        <input
          autoComplete="title"
          name="title"
          type="text"
          placeholder="New Title"
          value={newTitle}
          onChange={onNewTitleInputChange}
        />
      </label>
      <button
        className="button button-secondary"
        type="button"
        onClick={onUpdateTitleButtonClick}
      >
        Update Title
      </button>
    </form>
  </Overlay>
);

VocabListItemEditOverlay.propTypes = {
  newTitle: string.isRequired,
  isVisible: bool.isRequired,
  onNewTitleInputChange: func.isRequired,
  onCloseButtonClick: func.isRequired,
  onUpdateTitleButtonClick: func.isRequired,
};

export default VocabListItemEditOverlay;
