
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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
    <div className="forgot-password-page">
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
            type="text"
            value={email}
            onChange={
              ({ target: { value } }) => setEmail(value)
            }
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      { data && <p>{data.createPasswordToken.message}</p> }
      { loading && <p>Loading...</p> }
      { error && <p>Error :( Please try again</p> }
    </div>
  );
};

export default ForgotPasswordPage;
