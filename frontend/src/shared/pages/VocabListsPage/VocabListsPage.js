import React, { useState, useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';

import { RootLayout, Overlay, Dialog } from '../../layouts';
import {
  IconButton,
  Icon,
  Message,
} from '../../components';

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

  const creatorId = jwtDecode(token).id;
  const [file, setFile] = useState('');
  const [title, setTitle] = useState('');
  const [isEditTitleMode, setEditTitleMode] = useState(false);
  const [status, setStatusMessage] = useState('');
  const [currentList, setCurrentList] = useState({});
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const { loading, error, data } = useQuery(GET_LISTS, {
    variables: { creatorId },
    // onCompleted: (data) => {
    //   if (data.getLists.length > 0)
    // console.log('date', new Date(data.getLists[0].createdAt).getTime());
    // },
  });
  const [addList] = useMutation(ADD_LIST,
    { refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }] });
  const [
    updateList,
    { loading: updateListMutationLoading, error: updateListMutationError },
  ] = useMutation(UPDATE_LIST, {
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });
  const [
    removeList,
    { loading: removeMutationLoading, error: removeMutationError },
  ] = useMutation(REMOVE_LIST, {
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });
  const subHeader = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const { offsetTop, offsetHeight } = subHeader.current;
      const isSticky = document.documentElement.scrollTop > (offsetTop + offsetHeight);
      setIsSticky(isSticky);
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <RootLayout>
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
              isVisible={isOverlayVisible}
              onCloseButtonClick={() => {
                setTitle('');
                setFile('');
                setStatusMessage('');
                setEditTitleMode(false);
                setOverlayVisibility(false);
              }}
            >
              <h1>{isEditTitleMode ? t('vocablists_form_title_editTitle') : t('vocablists_form_title_newList')}</h1>

              <form>
                <label htmlFor="title">
                  <span>{t('vocablists_form_label_title')}</span>
                  <input
                    name="title"
                    type="text"
                    placeholder={t('vocablists_form_placeholder_title')}
                    value={title}
                    onFocus={() => setStatusMessage('')}
                    onChange={({ target: { value } }) => setTitle(value)}
                  />
                </label>
                {!isEditTitleMode && (
                  <>
                    <label htmlFor="document">
                      <input
                        name="document"
                        type="file"
                        onFocus={() => setStatusMessage('')}
                        onChange={({ target: { files } }) => {
                          setFile(files[0]);
                        }}
                      />
                    </label>
                    {file.name && <Message type="info" content={file.name} />}
                  </>
                )}

                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    const titleMinLength = 3;
                    const titleMaxLength = 35;

                    if (title.length < titleMinLength || title.length > titleMaxLength) {
                      setStatusMessage(t('messages_error_titleMinMaxLength', { titleMinLength, titleMaxLength }));
                    } else if (!title.match(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]/g)) {
                      setStatusMessage(t('messages_error_titleNotValid'));
                    } else if (isEditTitleMode) {
                      updateList({ variables: { id: currentList.id, name: title } });
                      setEditTitleMode(false);
                      setStatusMessage('');
                      setOverlayVisibility(false);
                    } else if (file && !file.name.match(/\.[xls(?x)|csv]+$/)) {
                      setStatusMessage(t('messages_error_fileTypeIncorrect'));
                    } else {
                      addList({ variables: { name: title, file, creatorId } });
                      setOverlayVisibility(false);
                      setTitle('');
                      setFile('');
                      setStatusMessage('');
                    }
                  }}
                >
                  {isEditTitleMode ? t('vocablists_form_button_edit') : t('vocablists_form_button_add')}
                </button>
                { status && <Message type="error" id="status" content={status} /> }
              </form>
            </Overlay>

            <div className="content">
              <h1>{t('vocablists_title')}</h1>

              <div ref={subHeader} className={`sub-header ${isSticky ? 'is-sticky' : ''}`}>
                <IconButton
                  icon="add-list"
                  type="primary"
                  onClick={() => {
                    setTitle('');
                    setOverlayVisibility(true);
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
                          setTitle(list.name);
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
        || updateListMutationError) && <Message type="error" content={t('messages_error_pleaseTryAgain')} />}

        {(loading
        || removeMutationLoading
        || updateListMutationLoading) && <Message type="info" content={t('messages_info_loading')} /> }
      </div>
    </RootLayout>
  );
};
export default VocabListsPage;
