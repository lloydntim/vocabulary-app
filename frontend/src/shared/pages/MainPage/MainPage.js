import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { ContentLayout, Overlay } from '../../layouts';
import {
  IconButton,
  Icon,
  Dialog,
  Message,
} from '../../components';

import './MainPage.scss';

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
  mutation RemoveList($id: ID!) {
    removeList(id: $id) {
      id
      name
    }
  }
`;

const MainPage = () => {
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');

  if (!token) {
    return <Redirect to="/" />;
  }

  const creatorId = jwtDecode(token).id;
  const [file, setFile] = useState('');
  const [title, setTitle] = useState('');
  const [isEditTitleMode, setEditTitleMode] = useState(false);
  const [currentList, setCurrentList] = useState({});
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const { loading, error, data } = useQuery(GET_LISTS, { variables: { creatorId } });
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

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <ContentLayout>
      <div className="home-page page">
        <Dialog
          title="Delete List Item"
          message={`You'll lose all data of list "${currentList.name}"`}
          cancelButtonText="Cancel"
          continueButtonText="Ok"
          isVisible={isDialogVisible}
          onCancelButtonClick={() => setDialogVisibility(false)}
          onContinueButtonClick={() => {
            removeList({ variables: { id: currentList.id } });
            setDialogVisibility(false);
            setCurrentList({});
          }}
        />
        <Overlay
          isVisible={isOverlayVisible}
          onCloseButtonClick={() => {
            setTitle('');
            setFile('');
            setEditTitleMode(false);
            setOverlayVisibility(false);
          }}
        >
          <h1>{isEditTitleMode ? 'Edit Vocab List Title' : 'New Vocab List'}</h1>

          <form>
            <label htmlFor="title">
              <span>Title</span>
              <input
                name="title"
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={({ target: { value } }) => setTitle(value)}
              />
            </label>
            {!isEditTitleMode && (
              <>
                <label htmlFor="document">
                  <input
                    name="document"
                    type="file"
                    onChange={({ target: { files } }) => setFile(files[0])}
                  />
                </label>
                {file.name && <Message type="info" content={file.name} />}
              </>
            )}

            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                if (isEditTitleMode) {
                  updateList({ variables: { id: currentList.id, name: title } });
                  setEditTitleMode(false);
                } else {
                  addList({ variables: { name: title, file, creatorId } });
                }

                setTitle('');
                setFile('');
                setOverlayVisibility(false);
              }}
            >
              {isEditTitleMode ? 'Edit' : 'Add'}
            </button>
          </form>
        </Overlay>

        <div className="content">
          <h1>Dashboard</h1>

          <div className="sub-header">
            <h3>Vocabulary Lists</h3>
            <IconButton
              icon="add-list"
              type="primary"
              onClick={() => {
                setTitle('');
                setOverlayVisibility(true);
              }}
            />
          </div>

          {updateListMutationLoading && <Message type="info" content="Loading..." /> }
          {updateListMutationError && <Message type="error" content="Please try again" />}
          {removeMutationLoading && <Message type="info" content="Loading..." /> }
          {removeMutationError && <Message type="error" content="Please try again" />}

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
                      {`${list.data.length} Phrases`}
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
      </div>
    </ContentLayout>
  );
};
export default MainPage;
