import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Joyride from 'react-joyride';
import jwtDecode from 'jwt-decode';

import { useStickyHeader, useJoyride } from '../../hooks';
import { RootLayout } from '../../layouts';
import { Switch, Message, Icon } from '../../components';

import { vocabListPageJoyride } from '../../joyrides';
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

export const GET_LIST_VOCAB_TRANSLATION = gql`
  query GetListVocabTranslation($sourceLanguage: String, $targetLanguage: String, $sourceText: String) {
    getListVocabTranslation(sourceLanguage: $sourceLanguage, targetLanguage: $targetLanguage, sourceText: $sourceText) {
      targetText
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

  const [translatedText, setTranslatedText] = useState('');
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

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

  const [getListVocabTranslation,
    { getListVocabTransLoading, getListVocabTransError }] = useLazyQuery(
    GET_LIST_VOCAB_TRANSLATION, {
      onCompleted: ({ getListVocabTranslation: { targetText } }) => setTranslatedText(targetText),
    },
  );

  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');
  const creatorId = jwtDecode(token).id;

  const [
    addList,
    { loading: addListMutationLoading, error: addListMutationError },
  ] = useMutation(ADD_LIST, {
    onCompleted: (data) => push(`/vocablist/${data.addList.id}`),
    onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }],
  });

  const [
    updateList,
    { loading: updateListMutationLoading, error: updateListMutationError },
  ] = useMutation(UPDATE_LIST, {
    onCompleted: (data) => {
      const { data: list } = data.updateList;
      const shuffledList = list
        ? list
          .map((translation) => translation)
          .sort(() => (0.5 - Math.random())) : [];
      setVocabListData({ name, list, shuffledList });
    },
    onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    refetchQueries: [{ query: GET_LIST, variables: { id } }],
  });

  const { stickyHeaderRef, isHeaderSticky } = useStickyHeader();
  const { run, stepIndex, steps, styles, callback, updateJoyride, locale } = useJoyride(vocabListPageJoyride);

  useEffect(() => {
    /* eslint-disable no-undef */
    const isVocablistEditModeJoyrideFinished = localStorage.getItem('isVocablistEditModeJoyrideFinished');
    if (isVocablistEditModeJoyrideFinished === null) {
      updateJoyride({ run: true, stepIndex });
      localStorage.setItem('isVocablistEditModeJoyrideFinished', false);
    }
    if (isVocablistEditModeJoyrideFinished === 'false') {
      updateJoyride({ run: true, stepIndex });
    }
  }, []);

  return (
    <RootLayout>
      <div className="vocab-list-page page">
        {data && (
          <>
            <VocabListEditOverlay
              isVisible={isOverlayVisible}
              onCloseButtonClick={() => setOverlayVisibility(false)}
              onUpdateTitleButtonClick={(name) => {
                setOverlayVisibility(false);
                updateList({ variables: { id, name } });
              }}
            />
            <div className="content">
              <Joyride
                steps={steps(t)}
                run={run}
                callback={callback({ isOverlayVisible, run, updateJoyride })}
                stepIndex={stepIndex}
                styles={styles}
                locale={locale(t)}
                showProgress
                continuous
                showSkipButton
              />
              <h1>{name}</h1>
              <div ref={stickyHeaderRef} className={`sub-header ${isHeaderSticky ? 'is-sticky' : ''}`}>
                <Link to="/vocablists">
                  <div className="icon">
                    <Icon type="home" />
                  </div>
                </Link>
                <Switch
                  name="edit-mode"
                  label={t(`vocablist_switch_label_${isEditMode ? 'edit' : 'practice'}Mode`)}
                  isActive={isEditMode}
                  disabled={list.length < 1}
                  onChange={({ target }) => setEditMode(target.checked)}
                />
              </div>
              {!isEditMode ? <VocabListSessionContainer list={shuffledList} setJoyride={updateJoyride} />
                : (
                  <VocabListEditContainer
                    id={id}
                    creatorId={creatorId}
                    list={list}
                    addList={addList}
                    updateList={updateList}
                    getListVocabTranslation={getListVocabTranslation}
                    translatedText={translatedText}
                    setTranslatedText={setTranslatedText}
                    setJoyride={updateJoyride}
                  />
                )}
            </div>
          </>
        )}

        {error && <Message type="error" content={error.message.split(':')[1].trim()} />}
        {(loading
          || updateListMutationLoading
          || addListMutationLoading
          || getListVocabTransLoading
        ) && <Message type="info" content={t('messages_info_loading')} /> }
        {(updateListMutationError
          || addListMutationError
          || getListVocabTransError
        ) && <Message type="error" content={responseMessage} />}
      </div>
    </RootLayout>
  );
};
export default VocabListPage;
