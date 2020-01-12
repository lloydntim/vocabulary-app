import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, Redirect, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import './VocabListPage.scss';

export const GET_LIST = gql`
  query GetList($id: ID, $name: String) {
    getList(id: $id,  name: $name) {
      name
      data
    }
  }
`;

export const GET_LISTS = gql`
  query GetLists($creatorId: ID) {
    getLists(creatorId: $creatorId) {
      name
      id
    }
  }
`;

export const UPDATE_LIST = gql`
  mutation UpdateList($id: ID!, $name: String!) {
    updateList(id: $id, name: $name) {
      id
      name
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

const VocabListPage = () => {
  const [count, setCount] = useState(0);
  const [isLanguageSwitched, toggleLanguage] = useState(false);
  const [status, setStatusMessage] = useState('');
  const [inputToText, handleInputToText] = useState('');
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_LIST, { variables: { id } });
  const titleInput = React.createRef();

  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');
  const creatorId = jwtDecode(token).id;

  const [
    updateList,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_LIST, {
    refetchQueries: ['GetList'],
  });
  const [
    removeList,
    { loading: removeMutationLoading, error: removeMutationError },
  ] = useMutation(REMOVE_LIST,
    {
      refetchQueries: [{ query: GET_LIST, variables: { id } },
        { query: GET_LISTS, variables: { creatorId } }],
    });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  if (typeof data.getList === 'undefined' || data.getList === null) return <Redirect to="/home" />;

  const list = data.getList;
  const { name: title, data: translationsData } = list;
  const translations = translationsData || [['SourceLanguage Placeholder', 'TargetLanguage Placeholder', 'SourceText', 'TargetText']];

  const [langA, langB, textA, textB] = translations[count];
  let transFromLang;
  let transToLang;
  let transFromText;
  let transToText;

  if (isLanguageSwitched) {
    transFromLang = langA;
    transToLang = langB;
    transFromText = textA;
    transToText = textB;
  } else {
    transFromLang = langB;
    transToLang = langA;
    transFromText = textB;
    transToText = textA;
  }

  return (
    <div className="vocab-list-page">
      <Link to="/logout">Logout</Link>

      <h1>Vocab List</h1>

      <h3>{title}</h3>

      { translations ? (
        <table>
          <tbody>
            <tr>
              <td />
              <td>{`${count + 1} of ${translations.length}`}</td>
            </tr>
            <tr>
              <td>{transFromLang}</td>
              <td>{transFromText}</td>
            </tr>
            <tr>
              <td>{transToLang}</td>
              <td><input type="text" id="translation" value={inputToText} onChange={({ target: { value } }) => handleInputToText(value)} /></td>
            </tr>
          </tbody>
        </table>
      ) : <p>No translations available</p> }

      <p id="status">{status}</p>

      <button
        type="button"
        onClick={
          () => {
            const statusMessage = transToText === inputToText ? 'Success' : 'Failure';
            setStatusMessage(statusMessage);
          }
        }
      >
        submit
      </button>
      <button
        type="button"
        onClick={
          () => setStatusMessage('')
        }
      >
        clear
      </button>
      <br />
      <br />
      <button
        type="button"
        onClick={
          () => toggleLanguage(!isLanguageSwitched)
        }
      >
        switch
      </button>
      <br />
      <br />
      <button
        type="button"
        onClick={
          () => {
            if (count > 0) {
              setCount(count - 1);
              handleInputToText('');
            }
          }
        }
      >
        backward
      </button>
      <button
        type="button"
        onClick={
          () => {
            if (count < translations.length - 1) {
              setCount(count + 1);
              handleInputToText('');
            }
          }
        }
      >
        forward
      </button>

      <button
        type="button"
        onClick={() => {
          removeList({ variables: { id } });
        }}
      >
        delete
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          let vocabListTitle = titleInput.current.value;
          updateList({ variables: { id, name: vocabListTitle } });
          vocabListTitle = '';
        }}
      >
        <label htmlFor="title">
          <span>Title</span>
          <input name="title" type="text" ref={titleInput} />
        </label>
        <button type="submit">Update Title</button>
      </form>
      { mutationLoading && <p>Loading...</p> }
      { mutationError && <p>Error :( Please try again</p> }

      { removeMutationLoading && <p>Loading...</p> }
      { removeMutationError && <p>Error :( Please try again</p> }

    </div>
  );
};
export default VocabListPage;
