import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootLayout, Overlay, Dialog } from '../../layouts';
import { Message, IconButton } from '../../components';

import './UserPage.scss';

export const GET_USER = gql`
  query GetUser($id: ID, $username: String, $email: String) {
    getUser(id: $id, username: $username, email: $email) {
      username
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID, $username: String, $email: String) {
    updateUser(id: $id, username: $username, email: $email) {
      username
      email
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: ID) {
    removeUser(id: $id) {
      id
    }
  }
`;

export const REMOVE_LIST = gql`
  mutation RemoveList($id: ID, $creatorId: ID) {
    removeList(id: $id, creatorId: $creatorId) {
      creatorId
    }
  }
`;

const UserPage = () => {
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');

  if (!token) return <Redirect to="/" />;

  const { id } = useParams();
  const { push } = useHistory();
  const { t } = useTranslation();
  const [responseMessage, setResponseMessage] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [status, setStatusMessage] = useState('');
  const [
    removeList,
    { loading: removeListMutationLoading, error: removeListMutationError },
  ] = useMutation(REMOVE_LIST, {
    onCompleted: () => push('/login'),
  });

  const { loading, error, data } = useQuery(
    GET_USER, {
      variables: { id },
      // onCompleted: (data) => console.log(data),
      onError: (error) => {
        const errorMessage = error.message.split(':')[1].trim();
        setResponseMessage(errorMessage);
      },
    },
  );

  const [
    updateUser,
    {
      data: updateUserMutationData,
      loading: updateUserMutationLoading,
      error: updateUserMutationError,
    },
  ] = useMutation(
    UPDATE_USER, {
      onCompleted: (data) => {
        const { username, email } = data.updateUser;
        setResponseMessage(t('messages_success_emailUpdated', { username, email }));
      },
      onError: (error) => {
        const errorMessage = error.message.split(':')[1].trim();
        setResponseMessage(errorMessage);
      },
      refetchQueries: [{ query: GET_USER, variables: { id } }],
    },
  );

  const [
    removeUser,
    { loading: removeUserMutationLoading, error: removeUserMutationError },
  ] = useMutation(
    REMOVE_USER, {
      onCompleted: ({ removeUser: { id } }) => {
        removeList({ variables: { creatorId: id } });
      },
      onError: (error) => {
        const errorMessage = error.message.split(':')[1].trim();
        setResponseMessage(errorMessage);
      },
    },
  );

  return (
    <div className="user-page page">
      <Dialog
        title={t('profile_dialog_title_deleteAccount')}
        cancelButtonText={t('common_button_cancel')}
        continueButtonText={t('profile_dialog_button_delete')}
        isVisible={isDialogVisible}
        onCancelButtonClick={() => setDialogVisibility(false)}
        onContinueButtonClick={() => {
          removeUser({ variables: { id } });
          setDialogVisibility(false);
        }}
      >
        {t('profile_dialog_message_deleteAccountWarning')}
      </Dialog>
      <Overlay
        isVisible={isOverlayVisible}
        onCloseButtonClick={() => {
          setUpdatedEmail('');
          setStatusMessage('');
          setOverlayVisibility(false);
        }}
      >
        <h1>{t('profile_form_title_editEmail')}</h1>

        <form>
          <label htmlFor="email">
            <span>{t('common_form_label_email')}</span>
            <input
              name="email"
              type="email"
              placeholder={t('common_form_placeholder_email')}
              value={updatedEmail}
              onFocus={() => setStatusMessage('')}
              onChange={({ target: { value } }) => setUpdatedEmail(value)}
            />
          </label>

          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              if (!updatedEmail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                setStatusMessage(t('messages_error_emailNotValid'));
              } else {
                updateUser({ variables: { id, email: updatedEmail } });
                setOverlayVisibility(false);
                setUpdatedEmail('');
                setStatusMessage('');
              }
            }}
          >
            {t('profile_form_button_updateEmail')}
          </button>
          { status && <Message type="error" id="status" content={status} /> }
        </form>
      </Overlay>

      <RootLayout>
        <div className="content">
          <div className="header">
            <h1>{t('profile_title')}</h1>

            <IconButton
              icon="edit"
              type="secondary"
              onClick={() => {
                setUpdatedEmail(data.getUser.email);
                setOverlayVisibility(true);
              }}
              disabled={!data}
            />
          </div>
          { data && (
            <>
              <h3>{data.getUser.username}</h3>
              <table>
                <tbody>
                  <tr>
                    <td>{t('common_form_label_email')}</td>
                    <td>{data.getUser.email}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setDialogVisibility(true);
                }}
              >
                {t('profile_button_deleteAccount')}
              </button>
            </>
          )}
          { (loading
            || updateUserMutationLoading
            || removeUserMutationLoading
            || removeListMutationLoading)
          && <Message type="info" content={t('messages_info_loading')} /> }
          { (error
          || updateUserMutationError
          || removeUserMutationError
          || removeListMutationError)
          && <Message type="error" content={responseMessage} /> }
          { updateUserMutationData && <Message type="success" content={responseMessage} /> }
        </div>
      </RootLayout>
    </div>
  );
};
export default UserPage;
