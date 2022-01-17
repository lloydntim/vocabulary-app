import React, { useState, useEffect, useCallback } from 'react';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory, Link, Redirect } from 'react-router-dom';
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

export const GET_LIST_VOCAB_SOUND = gql`
  query GetListVocabSound( $text: String, $languageCode: String) {
    getListVocabSound(text: $text, languageCode: $languageCode) {
      audioLink,
      audioKey,
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
/* eslint-disable indent  */
const VocabListPage = () => {
  const { t } = useTranslation();
  const { stickyHeaderRef, isHeaderSticky } = useStickyHeader();
  const vocabListPlayModeJoyride = useJoyride(vocabListSessionJoyride);
  const { run, stepIndex, steps, styles, callback, updateJoyride, locale } = useJoyride(vocabListPageJoyride);

  const [isEditMode, setEditMode] = useState(true);
  const [vocabVocabAudioURLs, setVocabAudioURLs] = useState([]);
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

  /* eslint-disable  no-undef  */
  const token = localStorage.getItem('token');

  if (!token) return <Redirect to="/" />;

  const { id: creatorId, username } = jwtDecode(token);

  const [
    addList,
    { loading: addListMutationLoading, error: addListMutationError },
  ] = useMutation(ADD_LIST, {
    onCompleted: (data) => setTimeout(() => push(`/vocablist/${data.addList.id}`)),
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

  const [getListVocabSound,
    { getListVocabSoundLoading, getListVocabSoundError }] = useLazyQuery(
      GET_LIST_VOCAB_SOUND, {
      onCompleted: ({ getListVocabSound: { audioLink, audioKey } }) => {
        setVocabAudioURLs([...vocabVocabAudioURLs, audioKey]);
        const audio = new Audio(audioLink);
        audio.play();
      },
      onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    },
    );

  useEffect(() => {
    /* eslint-disable no-undef */
    // const isVocablistEditModeJoyrideFinishedKey = `isVocablistEditModeJoyrideFinished-${username}`;
    // const isVocablistEditModeJoyrideFinished = localStorage.getItem(isVocablistEditModeJoyrideFinishedKey);
    const isVocablistEditModeJoyrideProgressKey = `isVocablistEditModeJoyrideProgress-${username}`;
    const isVocablistEditModeJoyrideProgress = localStorage.getItem(isVocablistEditModeJoyrideProgressKey);
    // if (isVocablistEditModeJoyrideFinished === null) {
    //   updateJoyride({ run: true, stepIndex });
    //   localStorage.setItem(isVocablistEditModeJoyrideFinishedKey, false);
    // }
    if (isVocablistEditModeJoyrideProgress === null) {
      updateJoyride({ run: true, stepIndex });
      localStorage.setItem(isVocablistEditModeJoyrideProgressKey, '');
    }
    // if (isVocablistEditModeJoyrideFinished === 'false') {
    //   console.log('isVocablistEditModeJoyrideProgress', isVocablistEditModeJoyrideProgress);
    //   const completedSteps = JSON.parse(isVocablistEditModeJoyrideProgress);
    //   const lastStep = completedSteps.slice(-1).pop();
    //   updateJoyride({ run: true, stepIndex: lastStep });
    // }
  }, []);

  const testFn = useCallback(({ variables: { languageCode, text } }) => {
    const textFormatted = text
      .replace(/[^a-zA-Z ]/g, '')// keep only normal letters
      .normalize('NFD') // NFD Unicode normal form decomposes combined graphemes into the combination of simple ones. reference: https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
      .replace(/[\u0300-\u036f]/g, '') // Remove accents and diactrics; reference: https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
      .replace(/ /g, '_');
    const audioKeyName = `${textFormatted}_${languageCode}.mp3`;
    const vocabURL = `https://thevocapp-bucket.s3.eu-west-2.amazonaws.com/${audioKeyName}`;
    if (vocabVocabAudioURLs.includes(audioKeyName)) {
      const audio = new Audio(vocabURL);
      audio.play();
    } else {
      getListVocabSound({ variables: { languageCode, text } });
    }
  }, [vocabVocabAudioURLs]);

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
                  type="arrow-left"
                  rank="secondary"
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
              {!isEditMode ? <VocabListSessionContainer id={id} list={shuffledList} joyride={vocabListPlayModeJoyride} />
                : (
                  <VocabListEditContainer
                    id={id}
                    creatorId={creatorId}
                    list={list}
                    addList={addList}
                    updateList={updateList}
                    getListVocabTranslation={getListVocabTranslation}
                    getListVocabSound={testFn}
                    vocabListData={{ name, list, shuffledList }}
                    setVocabListData={setVocabListData}
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
          || getListVocabSoundLoading
          || getListVocabTransLoading
        ) && <Message type="info" content={t('messages_info_loading')} />}
        {error && (
          <div className="message message-error">
            <span className="message-text">{responseMessage}</span>
            &nbsp;
            <Link className="message-link" to="/login">{t('common_button_login')}</Link>
          </div>
        )}
        {(updateListMutationError
          || addListMutationError
          || getListVocabTransError
          || getListVocabSoundError
        ) && <Message type="error" content={responseMessage} />}
      </div>
    </RootLayout>
  );
};
export default VocabListPage;
