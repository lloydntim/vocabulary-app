import React from 'react';
import { useTranslation } from 'react-i18next';
import { string, bool, func } from 'prop-types';

import { Message } from '../../components';
import { Overlay } from '../../layouts';

const VocabListItemEditOverlay = ({
  newTitle,
  isVisible,
  status,
  onNewTitleInputChange,
  onCloseButtonClick,
  onUpdateTitleButtonClick,
}) => {
  const { t } = useTranslation();
  return (
    <Overlay
      isVisible={isVisible}
      onCloseButtonClick={onCloseButtonClick}
    >
      <h1>{t('vocablist_form_title_vocabListTitle')}</h1>

      <form>
        <label htmlFor="title">
          <span>{t('vocablist_form_label_vocabListTitle')}</span>
          <input
            autoComplete="title"
            name="title"
            type="text"
            placeholder={t('vocablist_form_placeholder_newVocabListTitle')}
            value={newTitle}
            onChange={onNewTitleInputChange}
          />
        </label>
        <button
          className="button button-secondary"
          type="button"
          onClick={onUpdateTitleButtonClick}
        >
          {t('vocablist_form_button_updateTitle')}
        </button>
        { status && <Message type="error" id="status" content={status} /> }
      </form>
    </Overlay>
  );
};

VocabListItemEditOverlay.propTypes = {
  newTitle: string.isRequired,
  isVisible: bool.isRequired,
  status: string.isRequired,
  onNewTitleInputChange: func.isRequired,
  onCloseButtonClick: func.isRequired,
  onUpdateTitleButtonClick: func.isRequired,
};

export default VocabListItemEditOverlay;
