
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useForm } from '../../hooks';
import { RootLayout } from '../../layouts';
import { Message, Input, Button } from '../../components';

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

  const { formData: { email }, updateFormData, isFormValid } = useForm('email');
  const [responseMessage, setResponseMessage] = useState('');
  const [createPasswordToken, { loading, error, data }] = useMutation(
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
            type="primary"
            disabled={!isFormValid}
            text={t('common_button_submit')}
            onClick={() => createPasswordToken({ variables: { email: email.value } })}
          />
        </form>

        <div className="link-group">
          <Link to="/login">{t('common_button_back')}</Link>
        </div>

        { loading && <Message type="info" content={t('messages_info_loading')} /> }
        { data && <Message type="success" content={responseMessage} /> }
        { error && <Message type="error" content={responseMessage} /> }
      </div>
    </RootLayout>
  );
};

export default ForgotPasswordPage;
