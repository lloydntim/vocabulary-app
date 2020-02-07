import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, Redirect } from 'react-router-dom';

import { ContentLayout } from '../../layouts';
import { IconButton } from '../../components';

import VocabListSessionHeader from './VocabListSessionHeader';
import VocabListSessionBody from './VocabListSessionBody';
import VocabListEditOverlay from './VocabListEditOverlay';

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
  const [newTitle, setNewTitle] = useState('');
  const { id } = useParams();
  const { loading, error, data } = useQuery(
    GET_LIST,
    {
      variables: { id },
      onCompleted: (data) => {
        const { data: translationsData } = data.getList;
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
  const { name: title } = list;

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

        { translations ? (
          <div className="content">
            <VocabListSessionHeader
              title={title}
              sourceLanguage={transFromLang}
              targetLanguage={transToLang}
              onToggleLanguageButtonClick={() => toggleLanguage(!isLanguageSwitched)}
            />
            <VocabListSessionBody
              vocabsTotalCount={translations.length}
              currentVocab={count + 1}
              vocabSourceText={transFromText}
              vocabTranslationInputValue={translationText}
              vocabTranslationStatusMessage={status}
              onVocabTranslationInputChange={(event) => {
                setTranslationText(event.target.value);
                if (status) setStatusMessage('');
              }}
              onVocabTranslationInputFocus={() => {
                if (status) setStatusMessage('');
              }}
              onVocabTranslationSubmitButtonClick={() => {
                const statusMessage = transToText === translationText ? 'success' : 'error';
                setStatusMessage(statusMessage);
              }}
            />

            <ul>
              <li>
                <IconButton
                  type="secondary"
                  icon="backward"
                  onClick={
                    () => {
                      if (count > 0) {
                        setCount(count - 1);
                        setTranslationText('');
                      }
                    }
                  }
                />
              </li>
              <li>
                <IconButton
                  type="secondary"
                  icon="view"
                  onMouseDown={() => toggleLanguage(!isLanguageSwitched)}
                  onTouchStart={() => toggleLanguage(!isLanguageSwitched)}
                  onMouseUp={() => toggleLanguage(!isLanguageSwitched)}
                  onTouchEnd={() => toggleLanguage(!isLanguageSwitched)}
                />
              </li>
              <li>
                <IconButton
                  type="secondary"
                  icon="tick"
                  onClick={
                    () => {
                      setTranslationText('');
                      setStatusMessage('');
                    }
                  }
                />
              </li>
              <li>
                <IconButton
                  type="secondary"
                  icon="forward"
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
                />
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
