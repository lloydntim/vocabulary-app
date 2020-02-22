import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { ContentLayout } from '../../layouts';
import { Message } from '../../components';

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
      name
    }
  }
`;

const VocabListPage = () => {
  const [isEditMode, setEditMode] = useState(true);
  const [translations, setTranslations] = useState([]);

  const [isOverlayVisible, setOverlayVisibility] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const { id } = useParams();
  const { push } = useHistory();
  const { loading, error, data } = useQuery(
    GET_LIST,
    {
      variables: { id },
      onCompleted: (data) => {
        const { data: translationsData } = data.getList;
        const shuffledData = translationsData
          ? translationsData
            .map((translation) => translation)
            .sort(() => (0.5 - Math.random())) : [];
        setTranslations(shuffledData);
      },
    },
  );
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');
  const creatorId = jwtDecode(token).id;

  const [
    addList,
    { loading: addListMutationLoading, error: addListMutationError },
  ] = useMutation(ADD_LIST, { onCompleted: () => push('/home') }, {
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });

  const [
    updateList,
    { loading: updateListMutationLoading, error: updateListMutationError },
  ] = useMutation(UPDATE_LIST, {
    refetchQueries: [{ query: GET_LIST, variables: { id } }],
  });

  if (!data) {
    return (
      <ContentLayout>
        <div className="vocab-list-page page">
          {loading && <Message type="info" content="Loading..." />}
          {error && <Message type="error" content={`Error! ${error.message}`} />}
        </div>
      </ContentLayout>
    );
  }

  if (typeof data.getList === 'undefined' || data.getList === null) return <Redirect to="/home" />;

  const { name: title, data: list } = data.getList;
  const vocabList = list || [];

  return (
    <ContentLayout>
      <div className="vocab-list-page page">
        <VocabListEditOverlay
          newTitle={newTitle}
          isVisible={isOverlayVisible}
          onCloseButtonClick={() => { setOverlayVisibility(false); }}
          onNewTitleInputChange={({ target: { value } }) => setNewTitle(value)}
          onUpdateTitleButtonClick={() => {
            updateList({ variables: { id, name: newTitle } });
            setOverlayVisibility(false);
          }}
        />
        <div className="content">
          <h1>{title}</h1>
          <label className="edit-mode-checkbox" htmlFor="edit-mode">
            <span>Edit Mode</span>
            <input
              id="edit-mode"
              type="checkbox"
              checked={isEditMode}
              onChange={({ target }) => setEditMode(target.checked)}
            />
          </label>

          {!isEditMode ? <VocabListSessionContainer list={translations} />
            : (
              <VocabListEditContainer
                id={id}
                creatorId={creatorId}
                list={vocabList}
                addList={addList}
                updateList={updateList}
              />
            )}
        </div>
        {addListMutationLoading && <Message type="info" content="Loading..." /> }
        {addListMutationError && <Message type="error" content="Please try again" />}
        {updateListMutationLoading && <Message type="info" content="Loading..." /> }
        {updateListMutationError && <Message type="error" content="Please try again" />}
      </div>
    </ContentLayout>
  );
};
export default VocabListPage;
