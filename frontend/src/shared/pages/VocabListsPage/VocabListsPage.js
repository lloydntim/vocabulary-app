import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';
import Joyride from 'react-joyride';

import { vocabListsPageJoyride } from '../../joyrides';
import { useForm, useStickyHeader, useJoyride } from '../../hooks';
import { RootLayout, Overlay, Dialog } from '../../layouts';
import { Button, IconButton, Icon, Message, Input } from '../../components';

import './VocabListsPage.scss';

export const ADD_LIST = gql`
  mutation AddList($name: String!, $file: Upload, $data: [[String]], $creatorId: ID!) {
    addList(name: $name, file: $file, data: $data, creatorId: $creatorId) {
      name
    }
  }
`;

export const GET_LISTS = gql`
  query GetLists($creatorId: ID) {
    getLists(creatorId: $creatorId) {
      name
      data
      id
      createdAt

    }
  }
`;

export const UPDATE_LIST = gql`
  mutation UpdateList($id: ID!, $name: String, $file: Upload, $data: [[String]]) {
    updateList(id: $id, name: $name, file: $file, data: $data) {
      id
      name
      data
    }
  }
`;

export const REMOVE_LIST = gql`
  mutation RemoveList($id: ID, $creatorId: ID) {
    removeList(id: $id, creatorId: $creatorId) {
      id
      name
    }
  }
`;

const VocabListsPage = () => {
  /* eslint-disable  no-undef */
  const { t } = useTranslation();
  const token = localStorage.getItem('token');

  if (!token) return <Redirect to="/" />;

  const { id: creatorId, username } = jwtDecode(token);
  const inputNames = ['title', 'listFile'];
  const { formData, updateFormData, isFormValid, resetFormData } = useForm(inputNames);
  const { title, listFile } = formData;

  const [isEditTitleMode, setEditTitleMode] = useState(false);
  const [currentList, setCurrentList] = useState({ name: '', id: '' });
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const { run, stepIndex, steps, styles, locale, callback, updateJoyride } = useJoyride(vocabListsPageJoyride);
  const { loading, error, data } = useQuery(GET_LISTS, { variables: { creatorId }, onError: (error) => setResponseMessage(error.message.split(':')[1].trim()) });
  const [addList] = useMutation(ADD_LIST, {
    onCompleted: () => setTimeout(() => updateJoyride({ run: true, stepIndex: 6 }), 1000),
    onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });
  const [
    updateList,
    { loading: updateListMutationLoading, error: updateListMutationError },
  ] = useMutation(UPDATE_LIST, {
    onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });
  const [
    removeList,
    { loading: removeMutationLoading, error: removeMutationError },
  ] = useMutation(REMOVE_LIST, {
    onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });
  const { stickyHeaderRef, isHeaderSticky } = useStickyHeader();

  useEffect(() => {
    /* eslint-disable no-undef */
    const isVocablistsJoyrideFinishedKey = `isVocablistsJoyrideFinished-${username}`;
    const isVocablistsJoyrideFinished = localStorage.getItem(isVocablistsJoyrideFinishedKey);
    if (isVocablistsJoyrideFinished === null) {
      updateJoyride({ run: true, stepIndex });
      localStorage.setItem(isVocablistsJoyrideFinishedKey, false);
    }
    if (isVocablistsJoyrideFinished === 'false') {
      updateJoyride({ run: true, stepIndex });
    }
  }, []);

  return (
    <RootLayout
      onOpenMenuButtonClick={() => updateJoyride({ run: false })}
      onCloseMenuButtonClick={() => updateJoyride({ run: true, stepIndex: 2 })}
    >
      <div className="vocab-lists-page page">
        {data && (
          <>
            <Dialog
              title={t('vocablists_dialog_title')}
              cancelButtonText={t('common_button_cancel')}
              continueButtonText={t('common_button_ok')}
              isVisible={isDialogVisible}
              onCancelButtonClick={() => setDialogVisibility(false)}
              onContinueButtonClick={() => {
                removeList({ variables: { id: currentList.id } });
                setDialogVisibility(false);
                setCurrentList({});
              }}
            >
              {t('vocablists_dialog_messsage_deleteListWarning', { listName: currentList.name })}
            </Dialog>

            <Overlay
              title={t(`vocablists_form_title_${isEditTitleMode ? 'editTitle' : 'newList'}`)}
              isVisible={isOverlayVisible}
              onCloseButtonClick={() => {
                resetFormData();
                setEditTitleMode(false);
                setOverlayVisibility(false);
                updateJoyride({ run: false });
              }}
            >
              <form>
                <Input
                  label={t('vocablists_form_label_title')}
                  inputRef={title.ref}
                  required
                  autoComplete="off"
                  name={title.name}
                  minLength={3}
                  maxLength={35}
                  pattern={/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _-]{1,}$/}
                  placeholder={t('vocablists_form_placeholder_title')}
                  value={title.value}
                  onChange={updateFormData}
                  onBlur={updateFormData}
                />
                {!isEditTitleMode && (
                  <Input
                    label={t('common_button_upload')}
                    inputRef={listFile.ref}
                    type="file"
                    name={listFile.name}
                    pattern={/\.[xls(?x)|csv]+$/}
                    patternErrorMessage={t('messages_error_fileTypeIncorrect')}
                    onChange={updateFormData}
                  />
                )}
                <Button
                  type="secondary"
                  disabled={!isFormValid}
                  text={t(`vocablists_form_button_${isEditTitleMode ? 'edit' : 'add'}`)}
                  onClick={() => {
                    if (!isEditTitleMode) {
                      addList({ variables: { name: title.value, file: listFile.files[0], creatorId } });
                    } else {
                      updateList({ variables: { id: currentList.id, name: title.value } });
                      setEditTitleMode(false);
                    }
                    setOverlayVisibility(false);
                  }}
                />
              </form>
            </Overlay>

            <Joyride
              steps={steps(t)}
              run={run}
              callback={callback({ username, isOverlayVisible, run, updateJoyride })}
              stepIndex={stepIndex}
              styles={styles}
              locale={locale(t)}
              continuous
              showProgress={false}
              showSkipButton
            />

            <div className="content">
              <h1>{t('vocablists_title')}</h1>

              <div ref={stickyHeaderRef} className={`sub-header ${isHeaderSticky ? 'is-sticky' : ''}`}>
                <IconButton
                  icon="add-list"
                  type="primary"
                  onClick={() => {
                    resetFormData();
                    setOverlayVisibility(true);
                    updateJoyride({ run: true, stepIndex: 3 });
                  }}
                />
              </div>

              <ul className="list">
                {data.getLists.map((list) => (
                  <li className="list-item" key={list.id}>
                    <div className="button-group">
                      <IconButton
                        icon="edit"
                        type="secondary"
                        onClick={() => {
                          updateFormData({ name: title.name, value: list.name });
                          setCurrentList(list);
                          setEditTitleMode(true);
                          setOverlayVisibility(true);
                        }}
                      />
                      <IconButton
                        icon="delete"
                        type="secondary"
                        onClick={() => {
                          setCurrentList(list);
                          setDialogVisibility(true);
                        }}
                      />
                    </div>
                    <Link to={`/vocablist/${list.id}`}>
                      <div className="list-item-link-content">
                        <span>{list.name}</span>
                        <small>
                          {t('vocablists_numOfVocabs', { num: list.data.length })}
                        </small>
                      </div>
                      <div className="icon">
                        <Icon type="arrow-right" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {(error
        || removeMutationError
        || updateListMutationError) && <Message type="error" content={responseMessage} />}

        {(loading
        || removeMutationLoading
        || updateListMutationLoading) && <Message type="info" content={t('messages_info_loading')} /> }
      </div>
    </RootLayout>
  );
};
export default VocabListsPage;
