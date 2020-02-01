
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { InitLayout } from '../../layouts';

import './ForgotPasswordPage.scss';

export const CREATE_PASSWORD_TOKEN = gql`
  mutation CreatePasswordToken($email: String) {
    createPasswordToken(email: $email) {
      message
    }
  }
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [
    createPasswordToken,
    { loading, error, data },
  ] = useMutation(CREATE_PASSWORD_TOKEN);

  return (
    <InitLayout>
      <div className="forgot-password-page page">
        <h1>Forgot</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createPasswordToken({ variables: { email } });
            setEmail('');
          }}
        >
          <label htmlFor="email">
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={
                ({ target: { value } }) => setEmail(value)
              }
            />
          </label>

          <button type="submit">Submit</button>
        </form>

        { data && <p className="message message-success">{data.createPasswordToken.message}</p> }
        { loading && <p className="message message-info">Loading...</p> }
        { error && <p className="message message-error">Error - Please try again</p> }
      </div>
    </InitLayout>
  );
};

export default ForgotPasswordPage;
