
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Redirect, Link } from 'react-router-dom';

import { InitLayout } from '../../layouts';

import './LoginPage.scss';

export const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [
    login,
    { loading, error, data },
  ] = useMutation(LOGIN);

  /* eslint-disable no-undef */
  if (data) {
    localStorage.setItem('token', data.login.token);
    return <Redirect to="/home" />;
  }

  return (
    <InitLayout>
      <div className="login-page page">

        <h1>Login</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login({ variables: { username, password } });
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
          <label htmlFor="password">
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={
                ({ target: { value } }) => setPassword(value)
              }
            />
          </label>
          <button type="submit">Login</button>
        </form>

        <div className="link-group">
          <Link to="/signup">Sign Up</Link>
          <Link to="/forgot">Forgot Password</Link>
        </div>

        { loading && <p>Loading...</p> }
        { error && <p>Error :( Please try again</p> }
      </div>
    </InitLayout>
  );
};

export default LoginPage;