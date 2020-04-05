import React from 'react';
import { useTranslation } from 'react-i18next';
import { bool, func } from 'prop-types';

import { useForm } from '../../hooks';
import { Overlay } from '../../layouts';
import { Button, Input } from '../../components';

const VocabListItemEditOverlay = ({
  isVisible,
  onCloseButtonClick,
  onUpdateTitleButtonClick,
}) => {
  const { t } = useTranslation();
  const {
    formData: { newTitle },
    updateFormData,
    isFormValid,
  } = useForm(['newTitle']);
  return (
    <Overlay
      title={t('vocablist_form_title_vocabListTitle')}
      isVisible={isVisible}
      onCloseButtonClick={onCloseButtonClick}
    >
      <form>
        <Input
          label={t('vocablist_form_label_vocabListTitle')}
          inputRef={newTitle.ref}
          required
          name={newTitle.name}
          minLength={3}
          maxLength={35}
          pattern={/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]/g}
          placeholder={t('vocablist_form_placeholder_newVocabListTitle')}
          value={newTitle.value}
          onChange={updateFormData}
          onBlur={updateFormData}
        />
        <Button
          type="secondary"
          disabled={!isFormValid}
          text={t('vocablist_form_button_updateTitle')}
          onClick={() => onUpdateTitleButtonClick(newTitle.value)}
        />
      </form>
    </Overlay>
  );
};

VocabListItemEditOverlay.propTypes = {
  isVisible: bool.isRequired,
  onCloseButtonClick: func.isRequired,
  onUpdateTitleButtonClick: func.isRequired,
};

export default VocabListItemEditOverlay;
