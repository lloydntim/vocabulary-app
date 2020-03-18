import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';

import { RootLayout } from '../../layouts';
import { Switch, Message, Icon } from '../../components';

import VocabListSessionContainer from './VocabListSessionContainer';
import VocabListEditOverlay from './VocabListEditOverlay';
import VocabListEditContainer from './VocabListEditContainer';

import './VocabListPage.scss';

export const GET_LISTS = gql`
  query GetLists($creatorId: ID) {
    getLists(creatorId: $creatorId) {
      name
      data
      id
    }
  }
`;

export const GET_LIST = gql`
  query GetList($id: ID, $name: String) {
    getList(id: $id,  name: $name) {
      name
      data
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

export const ADD_LIST = gql`
  mutation AddList($name: String!, $file: Upload, $data: [[String]], $creatorId: ID!) {
    addList(name: $name, file: $file, data: $data, creatorId: $creatorId) {
      id
      name
    }
  }
`;

const VocabListPage = () => {
  const { t } = useTranslation();
  const [isEditMode, setEditMode] = useState(true);
  const [{ name, list, shuffledList }, setVocabListData] = useState({ name: '', list: [], shuffledList: [] });
  const [status, setStatusMessage] = useState('');
  const [isOverlayVisible, setOverlayVisibility] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const { id } = useParams();
  const { push } = useHistory();
  const { loading, error, data } = useQuery(
    GET_LIST,
    {
      variables: { id },
      onCompleted: (data) => {
        const { data: list, name } = data.getList;
        const shuffledList = list
          ? list
            .map((translation) => translation)
            .sort(() => (0.5 - Math.random())) : [];
        setVocabListData({ name, list, shuffledList });
      },
    },
  );
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');
  const creatorId = jwtDecode(token).id;

  const [
    addList,
    { loading: addListMutationLoading, error: addListMutationError },
  ] = useMutation(ADD_LIST, { onCompleted: (data) => push(`/vocablist/${data.addList.id}`) }, {
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });

  const [
    updateList,
    { loading: updateListMutationLoading, error: updateListMutationError },
  ] = useMutation(UPDATE_LIST, {
    onCompleted: (data) => {
      const { data: list } = data.updateList;
      setVocabListData({ name, list, shuffledList });
    },
    refetchQueries: [{ query: GET_LIST, variables: { id } }],
  });

  return (
    <RootLayout>
      <div className="vocab-list-page page">
        {data && (
          <>
            <VocabListEditOverlay
              newTitle={newTitle}
              isVisible={isOverlayVisible}
              status={status}
              onCloseButtonClick={() => {
                setOverlayVisibility(false);
                setStatusMessage('');
              }}
              onNewTitleInputChange={({ target: { value } }) => setNewTitle(value)}
              onUpdateTitleButtonClick={() => {
                const titleMinLength = 3;
                const titleMaxLength = 35;
                if (newTitle.length > titleMinLength || newTitle.length < titleMaxLength) {
                  setStatusMessage(t('messages_error_titleMinMaxLength', { titleMinLength, titleMaxLength }));
                } else if (newTitle.match(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]/g)) {
                  setStatusMessage(t('messages_error_titleNotValid'));
                } else {
                  setOverlayVisibility(false);
                  setStatusMessage('');
                  updateList({ variables: { id, name: newTitle } });
                }
              }}
            />
            <div className="content">
              <h1>{name}</h1>
              <div className="sub-header">
                <Link to="/vocablists">
                  <div className="icon">
                    <Icon type="home" />
                  </div>
                </Link>
                <Switch
                  name="edit-mode"
                  label={isEditMode ? t('vocablist_switch_label_editMode') : t('vocablist_switch_label_practiceMode')}
                  isActive={isEditMode}
                  onChange={({ target }) => setEditMode(target.checked)}
                />
              </div>
              {!isEditMode ? <VocabListSessionContainer list={shuffledList} />
                : (
                  <VocabListEditContainer
                    id={id}
                    creatorId={creatorId}
                    list={list}
                    addList={addList}
                    updateList={updateList}
                  />
                )}
            </div>
          </>
        )}

        {error && <Message type="error" content={error.message.split(':')[1].trim()} />}
        {(loading || updateListMutationLoading || addListMutationLoading) && <Message type="info" content={t('messages_info_loading')} /> }
        {(updateListMutationError || addListMutationError) && <Message type="error" content={t('messages_error_pleaseTryAgain')} />}
      </div>
    </RootLayout>
  );
};
export default VocabListPage;
