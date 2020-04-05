import React from 'react';
import { string, bool, func, object } from 'prop-types';

import VocabForm from './VocabForm';
import { Overlay } from '../../layouts';

const VocabEditOverlay = ({
  id,
  title,
  isVisible,
  form,
  translatedText,
  setTranslatedText,
  onUpdateVocabButtonClick,
  onCloseButtonClick,
}) => (
  <Overlay
    title={title}
    isVisible={isVisible}
    onCloseButtonClick={onCloseButtonClick}
  >
    <VocabForm
      id={id}
      form={form}
      translatedText={translatedText}
      setTranslatedText={setTranslatedText}
      isEditMode
      onSubmitVocabButtonClick={onUpdateVocabButtonClick}
    />
  </Overlay>
);

VocabEditOverlay.propTypes = {
  id: string.isRequired,
  title: string.isRequired,
  isVisible: bool.isRequired,
  form: object.isRequired,
  translatedText: string.isRequired,
  setTranslatedText: func.isRequired,
  onUpdateVocabButtonClick: func.isRequired,
  onCloseButtonClick: func.isRequired,
};

export default VocabEditOverlay;
