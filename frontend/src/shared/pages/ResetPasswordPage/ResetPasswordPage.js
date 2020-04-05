import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useForm } from '../../hooks';
import { RootLayout } from '../../layouts';
import { Message, Input, Button } from '../../components';

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
  const [responseMessage, setResponseMessage] = useState('');
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
          ? t('messages_error_emailDoesNotExist', { email }) : error.message;
        setResponseMessage(message);
      },
    },
  );

  const inputNames = ['password', 'passwordConfirm'];
  const { formData: { password, passwordConfirm }, updateFormData, isFormValid } = useForm(inputNames);

  const passwordsMatching = password.value === passwordConfirm.value;
  const isSubmitButtonDisabled = !(isFormValid && passwordsMatching);
  const passwordMinLength = 7;
  const passwordMaxLength = 15;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/;

  return (
    <RootLayout>
      <div className="reset-password-page page">
        <h1>{t('resetPassword_title')}</h1>
        {
          data && (
            <form>
              <Input
                label={t('common_form_placeholder_password')}
                inputRef={password.ref}
                autoComplete="new-password"
                required
                name={password.name}
                type="password"
                minLength={passwordMinLength}
                maxLength={passwordMaxLength}
                pattern={passwordPattern}
                placeholder={t('common_form_label_password')}
                value={password.value}
                onChange={updateFormData}
                onBlur={updateFormData}
              />
              <Input
                label={t('common_form_label_confirmPassword')}
                inputRef={passwordConfirm.ref}
                required
                autoComplete="new-password"
                name={passwordConfirm.name}
                type="password"
                minLength={passwordMinLength}
                maxLength={passwordMaxLength}
                pattern={passwordPattern}
                placeholder={t('common_form_placeholder_confirmPassword')}
                value={passwordConfirm.value}
                onChange={updateFormData}
                onBlur={updateFormData}
              />

              { (passwordConfirm.value.length > 0 && !passwordsMatching) && <Message type="error" content={t('messages_error_passwordsNotMatching')} /> }

              <Button
                type="primary"
                disabled={isSubmitButtonDisabled}
                text={t('common_button_submit')}
                onClick={() => updatePassword({ variables: { resetPasswordToken, password: password.value } })}
              />
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
