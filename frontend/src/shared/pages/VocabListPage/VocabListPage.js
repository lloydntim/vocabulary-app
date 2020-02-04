import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, Redirect } from 'react-router-dom';

import { ContentLayout, Overlay } from '../../layouts';
import { Icon } from '../../components';

import './VocabListPage.scss';

export const GET_LIST = gql`
  query GetList($id: ID, $name: String) {
    getList(id: $id,  name: $name) {
      name
      data
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

const VocabListPage = () => {
  const [count, setCount] = useState(0);
  const [translations, setTranslations] = useState([['SourceLanguage Placeholder', 'TargetLanguage Placeholder', 'SourceText', 'TargetText']]);
  const [isLanguageSwitched, toggleLanguage] = useState(false);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const [status, setStatusMessage] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [newTitle, setTitle] = useState('');
  const { id } = useParams();
  const { loading, error, data } = useQuery(
    GET_LIST,
    {
      variables: { id },
      onCompleted: (data) => {
        const { data: translationsData } = data.getList;
        setCount(2);
        const shuffledData = translationsData.sort(() => (0.5 - Math.random()));
        setTranslations(shuffledData);
      },
    },
  );
  /* eslint-disable  no-undef */
  // const token = localStorage.getItem('token');
  // const creatorId = jwtDecode(token).id;

  const [
    updateList,
    { loading: updateListMutationLoading, error: updateListMutationError },
  ] = useMutation(UPDATE_LIST, {
    refetchQueries: ['GetList'],
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  if (typeof data.getList === 'undefined' || data.getList === null) return <Redirect to="/home" />;

  const list = data.getList;
  const { name: title/* , data: translationsData */ } = list;
  // const translations = translationsData || [['SourceLanguage Placeholder',
  // 'TargetLanguage Placeholder', 'SourceText', 'TargetText']];

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
    <ContentLayout>
      <div className="vocab-list-page page">
        <Overlay
          isVisible={isOverlayVisible}
          onCloseButtonClick={
            () => { setOverlayVisibility(false); }
          }
        >
          <h1>Vocab List Title</h1>

          <form>
            <label htmlFor="title">
              <span>Title</span>
              <input
                autoComplete="title"
                name="title"
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={
                  ({ target: { value } }) => setTitle(value)
                }
              />
            </label>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                updateList({ variables: { id, name: newTitle } });
                setOverlayVisibility(false);
              }}
            >
              Update Title
            </button>
          </form>
        </Overlay>

        { translations ? (
          <div className="content">
            <h1>{title}</h1>
            <h5>
              <span>{transFromLang}</span>
              <span>
                <button
                  className="button-circle button-circle-secondary"
                  type="button"
                  onClick={() => toggleLanguage(!isLanguageSwitched)}
                >
                  <Icon type="swap" />
                </button>
              </span>
              <span>{transToLang}</span>
            </h5>

            <small>{`${count + 1} / ${translations.length}`}</small>

            <p>{transFromText}</p>

            <label htmlFor="translation">
              <textarea
                id="translation"
                className={`message message-${status}`}
                rows="4"
                value={translationText}
                placeholder="Enter translation"
                onFocus={() => {
                  if (status) setStatusMessage('');
                }}
                onChange={
                  ({ target: { value } }) => {
                    setTranslationText(value);
                    if (status) setStatusMessage('');
                  }
                }
              />
            </label>

            <button
              className={`button button-secondary ${translationText < 1 ? 'is-disabled' : ''}`}
              disabled={translationText < 1}
              type="button"
              onClick={
                () => {
                  const statusMessage = transToText === translationText ? 'success' : 'error';
                  setStatusMessage(statusMessage);
                }
              }
            >
              Submit
            </button>

            <ul>
              <li>
                <button
                  className="button-circle button-circle-secondary"
                  type="button"
                  onClick={
                    () => {
                      if (count > 0) {
                        setCount(count - 1);
                        setTranslationText('');
                      }
                    }
                  }
                >
                  <Icon type="backward" />
                </button>
              </li>
              <li>
                <button
                  className="button-circle button-circle-secondary"
                  type="button"
                  onMouseDown={() => toggleLanguage(!isLanguageSwitched)}
                  onTouchStart={() => toggleLanguage(!isLanguageSwitched)}
                  onMouseUp={() => toggleLanguage(!isLanguageSwitched)}
                  onTouchEnd={() => toggleLanguage(!isLanguageSwitched)}
                >
                  <Icon type="view" />
                </button>
              </li>
              <li>
                <button
                  className="button-circle button-circle-secondary"
                  type="button"
                  onClick={
                    () => {
                      setTranslationText('');
                      setStatusMessage('');
                      setStatusMessage('');
                    }
                  }
                >
                  <Icon type="tick" />
                </button>
              </li>
              <li>
                <button
                  className={`button-circle button-circle-secondary ${status !== 'success' ? 'is-disabled' : ''}`}
                  type="button"
                  disabled={status !== 'success'}
                  onClick={
                    () => {
                      if (count < translations.length - 1) {
                        setCount(count + 1);
                        setTranslationText('');
                        setStatusMessage('');
                      }
                    }
                  }
                >
                  <Icon type="forward" />
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className={`message message-${status === 'Success' ? 'success' : 'error'}`}>
            {status}
          </div>
        )}

        { updateListMutationLoading && <p className="message message-info">Loading...</p> }
        { updateListMutationError && <p className="message message-error">Error - Please try again</p> }

      </div>
    </ContentLayout>
  );
};
export default VocabListPage;
