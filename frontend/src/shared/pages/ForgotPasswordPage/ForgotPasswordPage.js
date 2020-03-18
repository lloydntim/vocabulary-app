
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootLayout } from '../../layouts';
import { Message } from '../../components';

import './ForgotPasswordPage.scss';

export const CREATE_PASSWORD_TOKEN = gql`
  mutation CreatePasswordToken($email: String) {
    createPasswordToken(email: $email) {
      message
    }
  }
`;

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatusMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [
    createPasswordToken,
    { loading, error, data },
  ] = useMutation(
    CREATE_PASSWORD_TOKEN, {
      onCompleted: (data) => setResponseMessage(data.createPasswordToken.message),
      onError: (error) => {
        const message = error.message.includes('email')
          ? t('messages_error_emailDoesNotExist', { email }) : t('messages_error_somethingWentWrong');
        setResponseMessage(message);
      },
    },
  );

  return (
    <RootLayout type="guest">
      <div className="forgot-password-page page">
        <h1>{t('forgotPassword_title')}</h1>

        <form>
          <label htmlFor="email">
            <span>{t('common_form_label_email')}</span>
            <input
              autoComplete="email"
              name="email"
              type="email"
              placeholder={t('common_form_placeholder_email')}
              value={email}
              onChange={
                ({ target: { value } }) => setEmail(value)
              }
              onFocus={() => {
                setResponseMessage('');
                setStatusMessage('');
              }}
            />
          </label>

          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              if (email.length < 1) {
                setStatusMessage(t('messages_error_emailEmpty'));
              } else {
                createPasswordToken({ variables: { email } });
                setEmail('');
                setStatusMessage('');
              }
            }}
          >
            Submit
          </button>

          { status && <Message type="error" id="status" content={status} /> }
        </form>

        <div className="link-group">
          <Link to="/">{t('common_button_back')}</Link>
        </div>

        { loading && <Message type="info" content={t('messages_info_loading')} /> }
        { data && <Message type="success" content={responseMessage} /> }
        { error && <Message type="error" content={responseMessage} /> }
      </div>
    </RootLayout>
  );
};

export default ForgotPasswordPage;
