import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import * as Sentry from '@sentry/browser';
import { useForm } from '../../hooks';
import { RootLayout } from '../../layouts';
import { Message, Input, Button } from '../../components';

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
  const inputNames = ['username', 'password'];
  const { formData, updateFormData, isFormValid } = useForm(inputNames);
  const { username, password } = formData;
  const [responseMessage, setResponseMessage] = useState('');
  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      /* eslint-disable no-undef */
      localStorage.setItem('token', data.login.token);
      push('/vocablists');
    },
    onError: (error) => {
      // Sentry.captureException(error);
      // console.log('Login: ', error);
      setResponseMessage(error.message.split(':')[1].trim());
    },
  });
  return (
    <RootLayout type="guest">
      <div className="login-page page">
        <h1>{t('login_title')}</h1>
        <form>
          <Input
            label={t('common_form_label_username')}
            autocapitalize="off"
            inputRef={username.ref}
            required
            autoComplete="username"
            name={username.name}
            placeholder={t('common_form_placeholder_username')}
            value={username.value}
            onChange={updateFormData}
            onBlur={updateFormData}
          />
          <Input
            label={t('common_form_placeholder_password')}
            autocapitalize="off"
            inputRef={password.ref}
            required
            name={password.name}
            type="password"
            placeholder={t('common_form_label_password')}
            value={password.value}
            onChange={updateFormData}
            onBlur={updateFormData}
          />
          <Button
            rank="primary"
            disabled={!isFormValid}
            text={t('common_button_login')}
            onClick={() =>
              login({
                variables: {
                  username: username.value.toLowerCase(),
                  password: password.value,
                },
              })
            }
          />
        </form>

        <div className="link-group">
          <Link to="/signup">{t('common_button_signup')}</Link>
          <Link to="/forgot">{t('login_forgotPassword')}</Link>
        </div>

        {loading && (
          <Message type="info" content={t('messages_info_loading')} />
        )}
        {responseMessage && <Message type="error" content={responseMessage} />}
      </div>
    </RootLayout>
  );
};

export default LoginPage;
