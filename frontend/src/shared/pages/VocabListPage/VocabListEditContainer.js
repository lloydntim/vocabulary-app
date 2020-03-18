import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { string, arrayOf, func } from 'prop-types';

import { Overlay, Tabs, Dialog } from '../../layouts';
import { Message } from '../../components';
import VocabForm from './VocabForm';
import VocabEditOverlay from './VocabEditOverlay';
import VocabListEditHeader from './VocabListEditHeader';
import VocabListEditBody from './VocabListEditBody';

const VocabListEditContainer = ({
  id,
  creatorId,
  list,
  addList,
  updateList,
}) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [file, setFile] = useState('');
  const [status, setStatusMessage] = useState('');
  const [isVocabEditOverlayVisible, setVocabEditOverlayVisibility] = useState(false);
  const [newVocabListTitle, setNewVocabListTitle] = useState('');
  const [isAddVocabOverlayVisible, setAddVocabOverlayVisibility] = useState(false);
  const [isCreateVocabListOverlayVisible, setCreateVocabListOverlayVisibility] = useState(false);
  const [sourceLanguageInputValue, setSourceLanguageInputValue] = useState('');
  const [targetLanguageInputValue, setTargetLanguageInputValue] = useState('');
  const [sourceTextInputValue, setSourceTextInputValue] = useState('');
  const [targetTextInputValue, setTargetTextInputValue] = useState('');
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [selectedVocabs, setSelectedVocabs] = useState([]);

  const languages = [
    t('common_languages_english'),
    t('common_languages_german'),
    t('common_languages_spanish'),
    t('common_languages_french'),
    t('common_languages_portuguese'),
  ];
  return (
    <>
      <VocabEditOverlay
        title={t('vocablist_form_title_editVocab')}
        isVisible={isVocabEditOverlayVisible}
        onCloseButtonClick={() => { setVocabEditOverlayVisibility(false); }}
        sourceLanguageDataList={languages}
        targetLanguageDataList={languages}
        status={status}
        sourceLanguageInputValue={sourceLanguageInputValue}
        targetLanguageInputValue={targetLanguageInputValue}
        sourceTextInputValue={sourceTextInputValue}
        targetTextInputValue={targetTextInputValue}
        onInputFocus={() => setStatusMessage('')}
        onSourceLanguageInputChange={({ target }) => setSourceLanguageInputValue(target.value)}
        onTargetLanguageInputChange={({ target }) => setTargetLanguageInputValue(target.value)}
        onSourceTextInputChange={({ target }) => setSourceTextInputValue(target.value)}
        onTargetTextInputChange={({ target }) => setTargetTextInputValue(target.value)}
        onSourceLanguageDataListClick={(selectedItem) => {
          setSourceLanguageInputValue(selectedItem);
        }}
        onTargetLanguageDataListClick={(selectedItem) => {
          setTargetLanguageInputValue(selectedItem);
        }}
        updateVocabButtonText={t('common_button_update')}
        onUpdateVocabButtonClick={() => {
          const sourcePhraseLength = sourceLanguageInputValue.length;
          const targetPhraseLength = targetLanguageInputValue.length;
          const phraseMaxLength = 150;
          if (sourcePhraseLength < 1) {
            setStatusMessage(t('messages_error_sourcePhraseEmpty'));
          } else if (sourcePhraseLength > phraseMaxLength) {
            setStatusMessage(t('messages_error_sourcePhraseMaxLength'));
          } else if (targetPhraseLength < 1) {
            setStatusMessage(t('messages_error_targetPhraseEmpty'));
          } else if (targetPhraseLength > phraseMaxLength) {
            setStatusMessage(t('messages_error_targetPhraseMaxLength'));
          } else {
            const vocabInputData = [
              sourceLanguageInputValue,
              targetLanguageInputValue,
              sourceTextInputValue,
              targetTextInputValue,
            ];
            const data = list.map((item, index) => (count === index ? vocabInputData : item));
            updateList({ variables: { id, data } });
            setVocabEditOverlayVisibility(false);
          }
        }}
      />
      <Overlay
        isVisible={isAddVocabOverlayVisible}
        onCloseButtonClick={() => setAddVocabOverlayVisibility(false)}
      >
        <h1>Add Vocab</h1>
        <Tabs titles={[t('common_button_create'), t('common_button_upload')]}>
          <content>
            <VocabForm
              sourceLanguageDataList={languages}
              targetLanguageDataList={languages}
              sourceLanguageInputValue={sourceLanguageInputValue}
              targetLanguageInputValue={targetLanguageInputValue}
              sourceTextInputValue={sourceTextInputValue}
              targetTextInputValue={targetTextInputValue}
              onInputFocus={() => setStatusMessage('')}
              onSourceLanguageInputChange={({ target }) => {
                setSourceLanguageInputValue(target.value);
              }}
              onTargetLanguageInputChange={({ target }) => {
                setTargetLanguageInputValue(target.value);
              }}
              onSourceLanguageDataListClick={(selectedItem) => {
                setSourceLanguageInputValue(selectedItem);
              }}
              onTargetLanguageDataListClick={(selectedItem) => {
                setTargetLanguageInputValue(selectedItem);
              }}
              onSourceTextInputChange={({ target }) => {
                setSourceTextInputValue(target.value);
              }}
              onTargetTextInputChange={({ target }) => {
                setTargetTextInputValue(target.value);
              }}
              status={status}
              submitVocabButtonText={t('common_button_create')}
              onSubmitVocabButtonClick={() => {
                const sourcePhraseLength = sourceLanguageInputValue.length;
                const targetPhraseLength = targetLanguageInputValue.length;
                const phraseMaxLength = 150;
                if (sourcePhraseLength < 1) {
                  setStatusMessage(t('messages_error_sourcePhraseEmpty'));
                } else if (sourcePhraseLength > phraseMaxLength) {
                  setStatusMessage(t('messages_error_sourcePhraseMaxLength'));
                } else if (targetPhraseLength < 1) {
                  setStatusMessage(t('messages_error_targetPhraseEmpty'));
                } else if (targetPhraseLength > phraseMaxLength) {
                  setStatusMessage(t('messages_error_targetPhraseMaxLength'));
                } else {
                  const vocabInputData = [
                    sourceLanguageInputValue,
                    targetLanguageInputValue,
                    sourceTextInputValue,
                    targetTextInputValue,
                  ];
                  const data = list.concat([vocabInputData]);
                  updateList({ variables: { id, data } });
                  setAddVocabOverlayVisibility(false);
                }
              }}
            />
          </content>
          <content>
            <form>
              <label htmlFor="document">
                <input
                  name="document"
                  type="file"
                  onFocus={() => setStatusMessage('')}
                  onChange={({ target: { files } }) => setFile(files[0])}
                />
              </label>
              {file.name && <Message type="info" content={file.name} />}
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  if (!file) {
                    setStatusMessage(t('messages_error_fileEmpty'));
                  } else {
                    updateList({ variables: { id, file } });
                    setFile('');
                    setStatusMessage('');
                    setAddVocabOverlayVisibility(false);
                  }
                }}
              >
                Add List
              </button>
              {status && <Message type="error" id="status" content={status} />}
            </form>
          </content>
        </Tabs>
      </Overlay>
      <Overlay
        isVisible={isCreateVocabListOverlayVisible}
        onCloseButtonClick={() => {
          setCreateVocabListOverlayVisibility(false);
          setNewVocabListTitle('');
          setStatusMessage('');
        }}
      >
        <h1>{t('vocablist_form_title_newVocabList')}</h1>
        <form>
          <label htmlFor="new-vocab-list-title">
            <span>{t('vocablist_form_label_newVocabListTitle')}</span>
            <input
              name="new-vocab-list-title"
              type="text"
              placeholder={t('vocablist_form_placeholder_newVocabListTitle')}
              value={newVocabListTitle}
              onChange={({ target: { value } }) => setNewVocabListTitle(value)}
            />
          </label>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              const titleMinLength = 3;
              const titleMaxLength = 35;
              const data = list.filter((val, index) => selectedVocabs.indexOf(index) !== -1);
              if (newVocabListTitle.length > titleMinLength
              || newVocabListTitle.length < titleMaxLength) {
                setStatusMessage(t('messages_error_titleMinMaxLength', { titleMinLength, titleMaxLength }));
              } else if (newVocabListTitle.match(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]/g)) {
                setStatusMessage(t('messages_error_titleNotValid'));
              } else {
                addList({ variables: { name: newVocabListTitle, data, creatorId } });
                setSelectedVocabs([]);
                setCreateVocabListOverlayVisibility(false);
                setNewVocabListTitle('');
                setStatusMessage('');
              }
            }}
          >
            {t('common_button_create')}
          </button>
          {status && <Message type="error" id="status" content={status} />}
        </form>
      </Overlay>
      <Dialog
        title={t('vocablist_dialog_title_deleteVocabs')}
        cancelButtonText={t('common_button_cancel')}
        continueButtonText={t('common_button_ok')}
        isVisible={isDialogVisible}
        onCancelButtonClick={() => setDialogVisibility(false)}
        onContinueButtonClick={() => {
          setCount(0);
          const data = list.filter((val, index) => selectedVocabs.indexOf(index) === -1);
          updateList({ variables: { id, data } });
          setDialogVisibility(false);
          setSelectedVocabs([]);
        }}
      >
        {t('vocablist_dialog_message_deleteVocabsWarning',
          { numOfVocabsSelected: selectedVocabs.length })}
      </Dialog>
      <VocabListEditHeader
        selectedVocabs={selectedVocabs}
        onDeleteVocabsButtonClick={() => setDialogVisibility(true)}
        onAddVocabButtonClick={() => {
          setSourceLanguageInputValue('');
          setTargetLanguageInputValue('');
          setSourceTextInputValue('');
          setTargetTextInputValue('');
          setAddVocabOverlayVisibility(true);
        }}
        onAddVocabListButtonClick={() => setAddVocabOverlayVisibility(true)}
        onCreateNewVocabListButtonClick={() => setCreateVocabListOverlayVisibility(true)}
        onEditVocabListTitleButtonClick={() => setAddVocabOverlayVisibility(true)}
      />
      <VocabListEditBody
        list={list}
        selectedVocabs={selectedVocabs}
        onVocabCheckboxChange={(index) => {
          const vocabs = selectedVocabs.indexOf(index) !== -1
            ? selectedVocabs
              .filter((vocab) => vocab !== index) : selectedVocabs.concat(index);
          setSelectedVocabs(vocabs);
          setCount(index);
        }}
        onVocabEditButtonClick={(index, item) => {
          const [sourceLanguage, targetLanguage, sourceText, targetText] = item;
          setCount(index);
          setSourceLanguageInputValue(sourceLanguage);
          setTargetLanguageInputValue(targetLanguage);
          setSourceTextInputValue(sourceText);
          setTargetTextInputValue(targetText);
          setVocabEditOverlayVisibility(true);
        }}
      />
    </>
  );
};

VocabListEditContainer.propTypes = {
  id: string.isRequired,
  creatorId: string.isRequired,
  list: arrayOf(arrayOf(string)).isRequired,
  addList: func.isRequired,
  updateList: func.isRequired,
};

export default VocabListEditContainer;
