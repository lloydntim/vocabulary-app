import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { ContentLayout, Overlay } from '../../layouts';
import { Icon, Dialog } from '../../components';

import './MainPage.scss';

export const ADD_LIST = gql`
  mutation AddList($name: String!, $file: Upload!, $creatorId: ID!) {
    addList(name: $name, file: $file, creatorId: $creatorId) {
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
  const [deletedListId, setDeletedListId] = useState('');
  const [deletedListTitle, setDeletedListTitle] = useState('');
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const { loading, error, data } = useQuery(GET_LISTS, { variables: { creatorId } });
  const [addList] = useMutation(ADD_LIST,
    { refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }] });
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
          message={`You'll lose all data of list "${deletedListTitle}"`}
          cancelButtonText="Cancel"
          continueButtonText="Ok"
          isVisible={isDialogVisible}
          onCancelButtonClick={() => setDialogVisibility(false)}
          onContinueButtonClick={
            () => {
              removeList({ variables: { id: deletedListId } });
              setDialogVisibility(false);
              setDeletedListId('');
              setDeletedListTitle('');
            }
          }
        />
        <Overlay
          isVisible={isOverlayVisible}
          onCloseButtonClick={
            () => { setOverlayVisibility(false); }
          }
        >
          <h1>New Vocab List</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addList({ variables: { name: title, file, creatorId } });
              setTitle('');
              setFile('');
              setOverlayVisibility(false);
            }}
          >
            <label htmlFor="title">
              <span>Title</span>
              <input
                name="title"
                type="text"
                placeholder="Title"
                onChange={
                  ({ target: { value } }) => setTitle(value)
                }
              />
            </label>

            <label htmlFor="document">
              <input
                name="document"
                type="file"
                onChange={
                  ({ target: { files } }) => setFile(files[0])
                }
              />
            </label>

            <button className="button button-secondary" type="submit">Add List</button>
          </form>
        </Overlay>

        <div className="content">
          <h1>Dashboard</h1>

          <div className="sub-header">
            <h3>Vocabulary Lists</h3>
            <button
              className="button-circle button-circle-primary"
              type="button"
              onClick={
                () => {
                  setTitle('');
                  setOverlayVisibility(true);
                }
              }
            >
              <Icon type="plus" />
            </button>
          </div>

          { removeMutationLoading && <p className="message message-info">Loading...</p> }
          { removeMutationError && <p className="message message-error">Error - Please try again</p> }

          <ul className="list">
            {data.getLists.map((list) => (
              <li className="list-item" key={list.id}>
                <div className="button-group">
                  <button
                    className="button-circle button-circle-secondary"
                    type="button"
                    onClick={() => {
                      setDeletedListId(list.id);
                      setDeletedListTitle(list.name);
                      setDialogVisibility(true);
                    }}
                  >
                    <Icon type="delete" />
                  </button>
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
