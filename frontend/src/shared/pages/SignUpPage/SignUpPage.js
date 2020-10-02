import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks';
import { RootLayout } from '../../layouts';
import { Message, Input, Button } from '../../components';

import './SignUpPage.scss';

export const REGISTER = gql`
  mutation Register($username: String, $email: String, $password: String) {
    register(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

const SignUpPage = () => {
  const { push } = useHistory();
  const { t } = useTranslation();
  const [responseMessage, setResponseMessage] = useState('');
  const inputNames = ['username', 'email', 'password', 'passwordConfirm'];
  const {
    formData,
    updateFormData,
    validateFormData,
    isFormValid,
  } = useForm(inputNames);
  const { username, email, password, passwordConfirm } = formData;
  const [
    register,
    { loading, error },
  ] = useMutation(
    REGISTER, {
      onCompleted: (data) => {
        // const { register: { user: { username } } } = data;
        /* eslint-disable no-undef */
        localStorage.setItem('token', data.register.token);
        push('/vocablists');
        // const responseText = username ? t('messages_success_userCreated', { username }) : t('messages_error_pleaseTryAgain');
        // setResponseMessage(responseText);
      },
      onError: (error) => setResponseMessage(error.message.split(':')[1].trim()),
    },
  );
  const passwordsMatching = password.value === passwordConfirm.value;
  const isSubmitButtonDisabled = !(isFormValid && passwordsMatching);
  const passwordMinLength = 7;
  const passwordMaxLength = 30;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/;

  return (
    <RootLayout type="guest">
      <div className="signup-page page">
        <h1>{t('signup_title')}</h1>

        <form>
          <Input
            label={t('common_form_label_username')}
            inputRef={username.ref}
            required
            autoComplete="off"
            name={username.name}
            minLength={3}
            maxLength={16}
            pattern={/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9_.-]{1,}$/g}
            placeholder={t('common_form_placeholder_username')}
            patternErrorMessage={t('messages_error_usernameRequirements')}
            value={username.value}
            onChange={updateFormData}
            onBlur={updateFormData}
          />
          <Input
            label={t('common_form_label_email')}
            inputRef={email.ref}
            required
            autoComplete="on"
            name={email.name}
            type="email"
            placeholder={t('common_form_placeholder_email')}
            value={email.value}
            onChange={updateFormData}
            onBlur={updateFormData}
          />
          <Input
            label={t('common_form_placeholder_password')}
            inputRef={password.ref}
            autoComplete="off"
            required
            name={password.name}
            type="password"
            minLength={passwordMinLength}
            maxLength={passwordMaxLength}
            pattern={passwordPattern}
            patternErrorMessage={t('messages_error_passwordMustContain')}
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
            placeholder={t('common_form_placeholder_confirmPassword')}
            value={passwordConfirm.value}
            onChange={updateFormData}
            onBlur={updateFormData}
          />
          { (passwordConfirm.value.length > 0 && !passwordsMatching) && <Message type="error" content={t('messages_error_passwordsNotMatching')} /> }
          <Button
            rank="primary"
            disabled={isSubmitButtonDisabled}
            text={t('common_button_signup')}
            onClick={() => {
              validateFormData(inputNames, formData);
              register({ variables: { username: username.value.toLowerCase(), email: email.value, password: password.value } });
            }}
          />

        </form>
        <div className="link-group">
          <Link to="/login">{t('common_button_login')}</Link>
        </div>
        { loading && <Message type="info" content={t('messages_info_loading')} /> }
        { (error && responseMessage) && <Message type="error" content={responseMessage} /> }
        {/* { (data && responseMessage) && <Message type="success" content={responseMessage} /> } */}
      </div>
    </RootLayout>
  );
};

export default SignUpPage;
