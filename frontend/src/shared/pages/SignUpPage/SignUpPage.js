import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootLayout } from '../../layouts';
import { Message, Input } from '../../components';

import './SignUpPage.scss';

export const REGISTER = gql`
  mutation Register($username: String, $email: String, $password: String) {
    register(username: $username, email: $email, password: $password) {
      user {
        username
      }
    }
  }
`;

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [status, setStatusMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const { t } = useTranslation();
  const [
    register,
    { loading, error, data },
  ] = useMutation(
    REGISTER, {
      onCompleted: (data) => {
        const { register: { user: { username } } } = data;
        const responseText = username ? t('messages_success_userCreated', { username }) : t('messages_error_pleaseTryAgain');
        setResponseMessage(responseText);
      },
      onError: (error) => {
        const errorMessage = error.message;
        if (errorMessage.includes('duplicate') && errorMessage.includes('username')) {
          setResponseMessage(t('messages_error_usernameTaken'));
        } else if (errorMessage.includes('duplicate') && errorMessage.includes('email')) {
          setResponseMessage(t('messages_error_emailTaken'));
        } else {
          setResponseMessage(t('messages_error_pleaseTryAgain'));
        }
      },
    },
  );

  return (
    <RootLayout type="guest">
      <div className="signup-page page">
        <h1>{t('signup_title')}</h1>

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
            label={t('common_form_label_email')}
            autoComplete="email"
            name="email"
            type="email"
            placeholder={t('common_form_placeholder_email')}
            value={email}
            onChange={setEmail}
            onFocus={() => { setResponseMessage(''); setStatusMessage(''); }}
          />
          <Input
            label={t('common_form_placeholder_password')}
            autoComplete="new-password"
            name="password"
            type="password"
            placeholder={t('common_form_label_password')}
            value={password}
            onChange={setPassword}
            onFocus={() => { setResponseMessage(''); setStatusMessage(''); }}
          />
          <Input
            label={t('common_form_label_confirmPassword')}
            autoComplete="new-password"
            name="password-confirm"
            type="password"
            placeholder={t('common_form_placeholder_confirmPassword')}
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            onFocus={() => { setResponseMessage(''); setStatusMessage(''); }}
          />
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              const usernameMinLength = 3;
              const usernameMaxLength = 16;
              const passwordMinLength = 7;
              const passwordMaxLength = 15;

              if (!username.match(/^[a-z0-9_-]{3,16}$/)) {
                setStatusMessage(t('messages_error_usernameRequirements', { usernameMinLength, usernameMaxLength }));
              } else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                setStatusMessage(t('messages_error_emailNotValid'));
              } else if (password.length < passwordMinLength) {
                setStatusMessage(t('messages_error_passwordMinLength', { passwordMinLength }));
              } else if (password.length > passwordMaxLength) {
                setStatusMessage(t('messages_error_passwordMaxLength'));
              } else if (!password.match(/^(?=.*[a-z])/)) {
                setStatusMessage(t('messages_error_passwordMustContainLowercaseChar'));
              } else if (!password.match(/^(?=.*[A-Z])/)) {
                setStatusMessage(t('messages_error_passwordMustContainUppercaseChar'));
              } else if (!password.match(/^(?=.*[!@#$%^&*])/)) {
                setStatusMessage(t('messages_error_passwordMustContainSpecialChar'));
              } else if (!password.match(/^(?=.*[0-9])/)) {
                setStatusMessage(t('messages_error_passwordMustContainNumber'));
              } else if (password !== passwordConfirm) {
                setStatusMessage(t('messages_error_passwordsNotMatching'));
              } else {
                register({ variables: { username, email, password } });
                setUsername('');
                setEmail('');
                setPassword('');
                setPasswordConfirm('');
                setStatusMessage('');
              }
            }}
          >
            {t('common_button_signup')}
          </button>

          { status && <Message type="error" id="status" content={status} /> }
        </form>
        <div className="link-group">
          <Link to="/login">{t('common_button_login')}</Link>
        </div>
        { loading && <Message type="info" content={t('messages_info_loading')} /> }
        { (error && responseMessage) && <Message type="error" content={responseMessage} /> }
        { (data && responseMessage) && <Message type="success" content={responseMessage} /> }
      </div>
    </RootLayout>
  );
};

export default SignUpPage;
