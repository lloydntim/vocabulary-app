
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Redirect, useParams } from 'react-router-dom';

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
  const { token: resetPasswordToken } = useParams();
  const {
    loading, error, data,
  } = useQuery(GET_PASSWORD_TOKEN, { variables: { resetPasswordToken } });
  const [
    updatePassword,
    { mutationLoading, mutationError, data: mutationData },
  ] = useMutation(UPDATE_PASSWORD_TOKEN);

  /* eslint-disable no-undef */
  if (mutationData) {
    localStorage.setItem('token', mutationData.updatePassword.token);
    return <Redirect to="/home" />;
  }

  return (
    <div className="reset-password-page">
      <h1>Reset Password</h1>

      {
        data && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== passwordConfirm) {
                setStatusMessage('Your passwords aren\'t matching, please re-enter.');
              } else {
                updatePassword({ variables: { resetPasswordToken, password } });
              }
              setPassword('');
              setPasswordConfirm('');
            }}
          >
            <label htmlFor="password">
              <span>Password</span>
              <input
                autoComplete="current-password"
                name="password"
                type="password"
                value={password}
                onChange={
                  ({ target: { value } }) => setPassword(value)
                }
              />
            </label>
            <label htmlFor="password-confirm">
              <span>Confirm Password</span>
              <input
                autoComplete="new-password"
                name="password-confirm"
                type="password"
                value={passwordConfirm}
                onChange={
                  ({ target: { value } }) => setPasswordConfirm(value)
                }
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        )
      }

      { mutationData && <p>{mutationData.updatePassword.message}</p> }
      { mutationLoading && <p>Loading...</p> }
      { mutationError && <p>Error :( Please try again</p> }

      { loading && <p>Loading...</p> }
      { error && <p>Error :( Please try again</p> }
    </div>
  );
};

export default ResetPasswordPage;
