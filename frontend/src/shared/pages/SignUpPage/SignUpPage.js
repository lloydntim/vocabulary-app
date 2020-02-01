import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { InitLayout } from '../../layouts';

import './SignUpPage.scss';

export const REGISTER = gql`
  mutation ($username: String!, $email: String, $password: String) {
    register(username: $username, email: $email, password: $password) {
      username
    }
  }
`;

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [status, setStatusMessage] = useState('');
  const [
    register,
    { loading: mutationLoading, error: mutationError, data },
  ] = useMutation(REGISTER);

  return (
    <InitLayout>
      <div className="signup-page">
        <h1>User Registration</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (password !== passwordConfirm) {
              setStatusMessage('Your passwords aren\'t matching, please re-enter.');
            } else {
              setUsername('');
              setEmail('');
              register({ variables: { username, email, password } });
            }
            setPassword('');
            setPasswordConfirm('');
          }}
        >
          <label htmlFor="username">
            <span>Username</span>
            <input
              autoComplete="username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={
                ({ target: { value } }) => setUsername(value)
              }
            />
          </label>

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

          <label htmlFor="password">
            <span>Password</span>
            <input
              autoComplete="new-password"
              name="password"
              type="password"
              placeholder="Password"
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
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={
                ({ target: { value } }) => setPasswordConfirm(value)
              }
            />
          </label>

          <button type="submit">Sign Up</button>
        </form>

        { status && <p className="message message-error" id="status">{status}</p> }

        { mutationLoading && <p className="message message-info">Loading...</p> }
        { mutationError && <p className="message message-error">Error - Please try again</p> }
        { data && <p className="message message-success">{`user ${data.register.username} has been created.`}</p> }
      </div>
    </InitLayout>
  );
};

export default SignUpPage;
