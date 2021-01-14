import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  useParams,
  useHistory,
  Redirect,
  Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useForm } from '../../hooks';
import { RootLayout, Overlay, Dialog } from '../../layouts';
import { Message, IconButton, Icon, Button, Input } from '../../components';

import './UserPage.scss';

export const RESEND_VERIFICATION_TOKEN = gql`
  mutation ResendVerificationToken($email: String, $username: String) {
    resendVerificationToken(email: $email, username: $username) {
      message
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID, $username: String, $email: String) {
    getUser(id: $id, username: $username, email: $email) {
      username
      email
      isVerified
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID, $username: String, $email: String) {
    updateUser(id: $id, username: $username, email: $email) {
      username
      email
      isVerified
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

  if (!token) return <Redirect to="/login" />;

  const { id } = useParams();
  const { push } = useHistory();
  const { t } = useTranslation();
  const { formData: { email }, updateFormData, resetFormData, isFormValid } = useForm(['email']);
  const [currentUser, setCurrentUser] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const [
    removeList,
    { loading: removeListMutationLoading, error: removeListMutationError },
  ] = useMutation(REMOVE_LIST, {
    onCompleted: () => push('/login'),
  });

  const [
    resendVerificationToken, {
      data: sendVerificationMutationData,
      loading: sendVerificationMutationLoading,
      error: sendVerificationMutationError,
    },
  ] = useMutation(RESEND_VERIFICATION_TOKEN, {
    onCompleted: ({ resendVerificationToken: { message } }) => setResponseMessage(message),
    refetchQueries: [{ query: GET_USER, variables: { id } }],
  });

  const { loading, error, data } = useQuery(
    GET_USER, { variables: { id },
      onCompleted: ({ getUser }) => setCurrentUser(getUser),
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
      onCompleted: ({ updateUser: { username, email } }) => setResponseMessage(t('messages_success_emailUpdated', { username, email })),
      onError: (error) => {
        const errorMessage = error.message.split(':')[1].trim();
        setResponseMessage(errorMessage);
      },
      refetchQueries: [{ query: GET_USER, variables: { id } }],
    },
  );

  const [removeUser, { loading: removeUserMutationLoading, error: removeUserMutationError }] = useMutation(
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
    <RootLayout>
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
          title={t('profile_form_title_editEmail')}
          isVisible={isOverlayVisible}
          onCloseButtonClick={() => {
            resetFormData();
            setOverlayVisibility(false);
          }}
        >
          <form>
            <Input
              label={t('common_form_label_email')}
              inputRef={email.ref}
              required
              autoComplete="email"
              name={email.name}
              type="email"
              placeholder={t('common_form_placeholder_email')}
              value={email.value}
              onChange={updateFormData}
              onBlur={updateFormData}
            />
            <Button
              rank="secondary"
              disabled={!isFormValid}
              text={t('profile_form_button_updateEmail')}
              onClick={() => {
                updateUser({ variables: { id, email: updatedEmail } });
                setOverlayVisibility(false);
              }}
            />
          </form>
        </Overlay>

        <div className="content">
          <div className="title-header">
            <h1>{t('profile_title')}</h1>

            <IconButton
              type="edit"
              rank="secondary"
              onClick={() => {
                updateFormData({ name: email.name, value: data.getUser.email });
                setOverlayVisibility(true);
              }}
              disabled={!data}
            />
          </div>

          { currentUser && (
            <>
              <div className="sub-header">
                <Link to="/vocablists"><Icon type="home" /></Link>
                <h3>{currentUser.username}</h3>
              </div>

              <div className="container">
                <div>
                  {t('common_form_label_email')}
                  :
                </div>
                <div>{currentUser.email}</div>
                <div>
                  {t('profile_table_cell_verificationStatus')}
                  :
                </div>
                <div>{currentUser.isVerified !== 'false' ? t('profile_table_cell_verified') : t('profile_table_cell_notVerified')}</div>
              </div>

              {currentUser.isVerified === 'false' && (
                <Button
                  rank="primary"
                  text={t('profile_button_resendVerificationEmail')}
                  onClick={() => {
                    resendVerificationToken({ variables: { email: currentUser.email, username: currentUser.username } });
                  }}
                />
              )}
              <Button
                rank="primary"
                text={t('profile_button_deleteAccount')}
                onClick={() => setDialogVisibility(true)}
              />
            </>
          )}
          { (loading
            || sendVerificationMutationLoading
            || updateUserMutationLoading
            || removeUserMutationLoading
            || removeListMutationLoading)
          && <Message type="info" content={t('messages_info_loading')} /> }
          {error && (
            <div className="message message-error">
              <span className="message-text">{responseMessage}</span>
              &nbsp;
              <Link className="message-link" to="/login">{t('common_button_login')}</Link>
            </div>
          )}
          {(error
          || sendVerificationMutationError
          || updateUserMutationError
          || removeUserMutationError
          || removeListMutationError)
          && <Message type="error" content={responseMessage} /> }
          { (updateUserMutationData || sendVerificationMutationData) && <Message type="success" content={responseMessage} /> }
        </div>
      </div>
    </RootLayout>
  );
};
export default UserPage;
