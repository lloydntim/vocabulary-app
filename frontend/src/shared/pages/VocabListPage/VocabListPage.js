import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory, /*  Link, */Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Joyride from 'react-joyride';
import jwtDecode from 'jwt-decode';

import { useStickyHeader, useJoyride } from '../../hooks';
import { RootLayout } from '../../layouts';
import { Switch, Message, IconButton/* , Icon */ } from '../../components';

import { vocabListPageJoyride, vocabListSessionJoyride } from '../../joyrides';
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
  const { stickyHeaderRef, isHeaderSticky } = useStickyHeader();
  const vocabListPlayModeJoyride = useJoyride(vocabListSessionJoyride);
  const { run, stepIndex, steps, styles, callback, updateJoyride, locale } = useJoyride(vocabListPageJoyride);

  const [isEditMode, setEditMode] = useState(true);
  const [{ name, list, shuffledList }, setVocabListData] = useState({ name: '', list: [], shuffledList: [] });

  const [newVocabData, setNewVocabData] = useState([]);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const { id } = useParams();
  const { push, goBack } = useHistory();
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
      onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    },
  );

  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');

  if (!token) return <Redirect to="/" />;

  const { id: creatorId, username } = jwtDecode(token);

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
      updateJoyride({ run: true, stepIndex: 1 });
    },
    onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    refetchQueries: [{ query: GET_LIST, variables: { id } }],
  });

  const [getListVocabTranslation,
    { getListVocabTransLoading, getListVocabTransError }] = useLazyQuery(
    GET_LIST_VOCAB_TRANSLATION, {
      onCompleted: ({ getListVocabTranslation: { targetText } }) => {
        const newVocabItem = [...newVocabData, targetText];
        const data = list.concat([newVocabItem]);
        updateJoyride({ run: true, stepIndex: 8 });
        updateList({ variables: { id, data } });
      },
      onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    },
  );

  useEffect(() => {
    /* eslint-disable no-undef */
    const isVocablistEditModeJoyrideFinishedKey = `isVocablistEditModeJoyrideFinished-${username}`;
    const isVocablistEditModeJoyrideFinished = localStorage.getItem(isVocablistEditModeJoyrideFinishedKey);
    const isVocablistEditModeJoyrideProgressKey = `isVocablistEditModeJoyrideProgress-${username}`;
    const isVocablistEditModeJoyrideProgress = localStorage.getItem(isVocablistEditModeJoyrideProgressKey);
    if (isVocablistEditModeJoyrideFinished === null) {
      updateJoyride({ run: true, stepIndex });
      localStorage.setItem(isVocablistEditModeJoyrideFinishedKey, false);
    }
    if (isVocablistEditModeJoyrideProgress === null) {
      updateJoyride({ run: true, stepIndex });
      localStorage.setItem(isVocablistEditModeJoyrideProgressKey, '');
    }
    if (isVocablistEditModeJoyrideFinished === 'false') {
      const completedSteps = JSON.parse(isVocablistEditModeJoyrideProgress);
      const lastStep = completedSteps.slice(-1).pop();
      console.log(lastStep);
      updateJoyride({ run: true, stepIndex: lastStep });
    }
  }, []);

  return (
    <RootLayout>
      <div className={`vocab-list-page page ${isEditMode ? 'is-edit-mode' : 'is-practice-mode'}`}>
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
                callback={callback({ isOverlayVisible, username, run, updateJoyride })}
                stepIndex={stepIndex}
                styles={styles}
                locale={locale(t)}
                showProgress={false}
                continuous
                showSkipButton
              />
              <h1>{name}</h1>
              <div ref={stickyHeaderRef} className={`sub-header ${isHeaderSticky ? 'is-sticky' : ''}`}>
                <IconButton
                  icon="arrow-left"
                  type="secondary"
                  onClick={() => goBack()}
                />
                {/* <Link to="/vocablists">
                  <div className="icon">
                    <Icon type="home" />
                  </div>
                </Link> */}
                <Switch
                  name="edit-mode"
                  label={t('vocablist_switch_label_practiceMode')}
                  isActive={!isEditMode}
                  disabled={list.length < 1}
                  onChange={({ target }) => setEditMode(!target.checked)}
                />
              </div>
              {!isEditMode ? <VocabListSessionContainer list={shuffledList} joyride={vocabListPlayModeJoyride} />
                : (
                  <VocabListEditContainer
                    id={id}
                    creatorId={creatorId}
                    list={list}
                    addList={addList}
                    updateList={updateList}
                    getListVocabTranslation={getListVocabTranslation}
                    setNewVocabData={setNewVocabData}
                    setJoyride={updateJoyride}
                  />
                )}
            </div>
          </>
        )}

        {(loading
          || updateListMutationLoading
          || addListMutationLoading
          || getListVocabTransLoading
        ) && <Message type="info" content={t('messages_info_loading')} />}
        {(error
          || updateListMutationError
          || addListMutationError
          || getListVocabTransError
        ) && <Message type="error" content={responseMessage} />}
      </div>
    </RootLayout>
  );
};
export default VocabListPage;
