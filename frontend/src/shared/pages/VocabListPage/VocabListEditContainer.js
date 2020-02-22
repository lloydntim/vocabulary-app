import React, { useState } from 'react';
import { string, arrayOf, func } from 'prop-types';

import { Overlay, Tabs } from '../../layouts';
import { Dialog, Message } from '../../components';
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
  const [count, setCount] = useState(0);
  const [file, setFile] = useState('');
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
  return (
    <>
      <VocabEditOverlay
        title="Edit Vocab"
        isVisible={isVocabEditOverlayVisible}
        onCloseButtonClick={() => { setVocabEditOverlayVisibility(false); }}
        sourceLanguageInputValue={sourceLanguageInputValue}
        targetLanguageInputValue={targetLanguageInputValue}
        sourceTextInputValue={sourceTextInputValue}
        targetTextInputValue={targetTextInputValue}
        onSourceLanguageInputChange={({ target }) => setSourceLanguageInputValue(target.value)}
        onTargetLanguageInputChange={({ target }) => setTargetLanguageInputValue(target.value)}
        onSourceTextInputChange={({ target }) => setSourceTextInputValue(target.value)}
        onTargetTextInputChange={({ target }) => setTargetTextInputValue(target.value)}
        updateVocabButtonText="Update"
        onUpdateVocabButtonClick={() => {
          const vocabInputData = [
            sourceLanguageInputValue,
            targetLanguageInputValue,
            sourceTextInputValue,
            targetTextInputValue,
          ];
          const data = list.map((item, index) => (count === index ? vocabInputData : item));
          updateList({ variables: { id, data } });
          setVocabEditOverlayVisibility(false);
        }}
      />
      <Overlay
        isVisible={isAddVocabOverlayVisible}
        onCloseButtonClick={() => { setAddVocabOverlayVisibility(false); }}
      >
        <h1>Add Vocab</h1>
        <Tabs titles={['Create', 'Upload']}>
          <content>
            <VocabForm
              sourceLanguageInputValue={sourceLanguageInputValue}
              targetLanguageInputValue={targetLanguageInputValue}
              sourceTextInputValue={sourceTextInputValue}
              targetTextInputValue={targetTextInputValue}
              onSourceLanguageInputChange={
                ({ target }) => setSourceLanguageInputValue(target.value)
              }
              onTargetLanguageInputChange={
                ({ target }) => setTargetLanguageInputValue(target.value)
              }
              onSourceTextInputChange={
                ({ target }) => setSourceTextInputValue(target.value)
              }
              onTargetTextInputChange={
                ({ target }) => setTargetTextInputValue(target.value)
              }
              submitVocabButtonText="Create"
              onSubmitVocabButtonClick={() => {
                const vocabInputData = [
                  sourceLanguageInputValue,
                  targetLanguageInputValue,
                  sourceTextInputValue,
                  targetTextInputValue,
                ];
                const data = list.concat([vocabInputData]);
                updateList({ variables: { id, data } });
                setAddVocabOverlayVisibility(false);
              }}
            />
          </content>
          <content>
            <form>
              <label htmlFor="document">
                <input
                  name="document"
                  type="file"
                  onChange={({ target: { files } }) => setFile(files[0])}
                />
              </label>

              {file.name && <Message type="info" content={file.name} />}
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  updateList({ variables: { id, file } });
                  setFile('');
                  setVocabEditOverlayVisibility(false);
                }}
              >
                Add List
              </button>
            </form>
          </content>
        </Tabs>
      </Overlay>
      <Overlay
        isVisible={isCreateVocabListOverlayVisible}
        onCloseButtonClick={() => {
          setCreateVocabListOverlayVisibility(false);
          setNewVocabListTitle('');
        }}
      >
        <h1>New Vocab List</h1>

        <form>
          <label htmlFor="new-vocab-list-title">
            <span>New Vocab List Title</span>
            <input
              name="new-vocab-list-title"
              type="text"
              placeholder="New Vocab List Title"
              value={newVocabListTitle}
              onChange={({ target: { value } }) => setNewVocabListTitle(value)}
            />
          </label>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              const data = list.filter((val, index) => selectedVocabs.indexOf(index) !== -1);
              addList({ variables: { name: newVocabListTitle, data, creatorId } });
              setSelectedVocabs([]);
              setCreateVocabListOverlayVisibility(false);
              setNewVocabListTitle('');
            }}
          >
            Create
          </button>
        </form>
      </Overlay>
      <Dialog
        title="Delete Vocabs"
        message={`You'll lose "${selectedVocabs.length} vocabs."`}
        cancelButtonText="Cancel"
        continueButtonText="Ok"
        isVisible={isDialogVisible}
        onCancelButtonClick={() => setDialogVisibility(false)}
        onContinueButtonClick={() => {
          setCount(0);
          const data = list.filter((val, index) => selectedVocabs.indexOf(index) === -1);
          updateList({ variables: { id, data } });
          setDialogVisibility(false);
          setSelectedVocabs([]);
        }}
      />
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
