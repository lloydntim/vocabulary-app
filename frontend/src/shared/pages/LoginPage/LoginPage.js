
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootLayout } from '../../layouts';
import { Message, Input } from '../../components';

import './LoginPage.scss';

export const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const LoginPage = () => {
  const { push } = useHistory();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatusMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [
    login,
    { loading },
  ] = useMutation(
    LOGIN, {
      onCompleted: (data) => {
        /* eslint-disable no-undef */
        localStorage.setItem('token', data.login.token);
        push('/vocablists');
      },
      onError: (error) => {
        const errorMessage = error.message;
        if (errorMessage.includes('username')) {
          setResponseMessage(t('messages_error_usernameDoesNotExists', { email }));
        } else if (errorMessage.includes('password')) {
          setResponseMessage(t('messages_error_passwordIsIncorrect'));
        } else {
          setResponseMessage(t('messages_error_pleaseTryAgain'));
        }
      },
    },
  );

  return (
    <RootLayout type="guest">
      <div className="login-page page">
        <h1>{t('login_title')}</h1>
        <form>
          <Input
            label={t('common_form_label_username')}
            autoComplete="username"
            name="username"
            type="text"
            placeholder={t('common_form_placeholder_username')}
            value={username}
            onChange={setUsername}
            onFocus={() => { setResponseMessage(''); setStatusMessage(''); }}
          />
          <Input
            label={t('common_form_label_password')}
            autoComplete="current-password"
            name="password"
            type="password"
            placeholder={t('common_form_placeholder_password')}
            value={password}
            onChange={setPassword}
            onFocus={() => { setResponseMessage(''); setStatusMessage(''); }}
          />
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              if (username.length < 1) {
                setStatusMessage(t('messages_error_usernameEmpty'));
              } else if (password.length < 1) {
                setStatusMessage(t('messages_error_passwordEmpty'));
              } else {
                login({ variables: { username, password } });
              }
            }}
          >
            {t('common_button_login')}
          </button>
          { status && <Message type="error" id="status" content={status} /> }
        </form>

        <div className="link-group">
          <Link to="/signup">{t('common_button_signup')}</Link>
          <Link to="/forgot">{t('login_forgotPassword')}</Link>
        </div>

        { loading && <Message type="info" content={t('messages_info_loading')} /> }
        { responseMessage && <Message type="error" content={responseMessage} /> }
      </div>
    </RootLayout>
  );
};

export default LoginPage;
