import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootLayout } from '../../layouts';
import { Message } from '../../components';

import './ResetPasswordPage.scss';

export const GET_PASSWORD_TOKEN = gql`
  query GetPasswordToken($resetPasswordToken: String) {
    getPasswordToken(resetPasswordToken: $resetPasswordToken) {
      token
    }
  }
`;

export const UPDATE_PASSWORD_TOKEN = gql`
  mutation UpdatePassword($resetPasswordToken: String, $password: String) {
    updatePassword(resetPasswordToken: $resetPasswordToken, password: $password) {
      token
    }
  }
`;

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [status, setStatusMessage] = useState('');
  const { push } = useHistory();
  const { t } = useTranslation();
  const { token: resetPasswordToken } = useParams();
  const {
    loading, error, data,
  } = useQuery(
    GET_PASSWORD_TOKEN, {
      variables: { resetPasswordToken },
      onError: ({ message }) => {
        setResponseMessage(message);
      },
    },
  );
  const [
    updatePassword,
    { mutationLoading, mutationError },
  ] = useMutation(
    UPDATE_PASSWORD_TOKEN, {
      onCompleted: (data) => {
        /* eslint-disable no-undef */
        localStorage.setItem('token', data.updatePassword.token);
        push('/vocablists');
      },
      onError: (error) => {
        const message = error.message.includes('email')
          ? t('messages_error_emailDoesNotExist', { email }) : t('messages_error_somethingWentWrong');
        setResponseMessage(message);
      },
    },
  );
  return (
    <RootLayout>
      <div className="reset-password-page">
        <h1>Reset Password</h1>

        {
          data && (
            <form>
              <label htmlFor="password">
                <span>{t('common_form_label_password')}</span>
                <input
                  autoComplete="current-password"
                  name="password"
                  type="password"
                  placeholder={t('common_form_placeholder_password')}
                  value={password}
                  onChange={({ target: { value } }) => setPassword(value)}
                  onFocus={() => {
                    setResponseMessage('');
                    setStatusMessage('');
                  }}
                />
              </label>
              <label htmlFor="password-confirm">
                <span>{t('common_form_label_confirmPassword')}</span>
                <input
                  autoComplete="new-password"
                  name="password-confirm"
                  type="password"
                  placeholder={t('common_form_placeholder_confirmPassword')}
                  value={passwordConfirm}
                  onChange={({ target: { value } }) => setPasswordConfirm(value)}
                  onFocus={() => {
                    setResponseMessage('');
                    setStatusMessage('');
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const passwordMinLength = 7;
                  const passwordMaxLength = 15;
                  if (password !== passwordConfirm) {
                    setStatusMessage(t('messages_error_passwordsNotMatching'));
                  } else if (password.length < passwordMinLength) {
                    setStatusMessage(t('messages_error_passwordMinLength', { passwordMinLength }));
                  } else if (password.length > passwordMaxLength) {
                    setStatusMessage(t('messages_error_passwordMaxLength', { passwordMaxLength }));
                  } else if (!password.match(/^(?=.*[a-z])/)) {
                    setStatusMessage(t('messages_error_passwordMustContainLowercaseChar'));
                  } else if (!password.match(/^(?=.*[A-Z])/)) {
                    setStatusMessage(t('messages_error_passwordMustContainUppercaseChar'));
                  } else if (!password.match(/^(?=.*[!@#$%^&*])/)) {
                    setStatusMessage(t('messages_error_passwordMustContainSpecialChar'));
                  } else if (!password.match(/^(?=.*[0-9])/)) {
                    setStatusMessage(t('messages_error_passwordMustContainNumber'));
                  } else {
                    updatePassword({ variables: { resetPasswordToken, password } });
                  }
                  setPassword('');
                  setPasswordConfirm('');
                }}
              >
                {t('common_button_submit')}
              </button>
              { status && <Message type="error" id="status" content={status} /> }
            </form>
          )
        }

        { (mutationLoading || loading) && <Message type="info" content={t('messages_info_loading')} /> }
        { (mutationError || error) && <Message type="error" content={responseMessage} /> }
      </div>
    </RootLayout>
  );
};

export default ResetPasswordPage;
