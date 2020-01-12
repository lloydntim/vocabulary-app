import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';

import './LogoutPage.scss';

export const GET_USER = gql`
  query GetUser($id: ID, $username: String, $email: String ) {
    getUser(id: $id, username: $username, email: $email) {
      username
    }
  }
`;

const LogoutPage = () => {
  /* eslint-disable no-undef */
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : {};

  if (user.id) {
    const {
      client, loading, data,
    } = useQuery(GET_USER,
      { variables: { id: user.id } });

    if (loading) return 'Loading...';

    if (data) {
      client.resetStore();
    }
  }

  localStorage.setItem('token', '');

  return (
    <div className="logout-page">
      <h1>You have been successfully logged out.</h1>
    </div>
  );
};

export default LogoutPage;
