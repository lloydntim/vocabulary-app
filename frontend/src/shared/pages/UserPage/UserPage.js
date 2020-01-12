import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useParams, Link, Redirect } from 'react-router-dom';

import './UserPage.scss';

export const GET_USER = gql`
  query GetUser($id: ID, $username: String, $email: String ) {
    getUser(id: $id, username: $username, email: $email) {
      username
      email
      lists
    }
  }
`;

const UserPage = () => {
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');

  if (!token) {
    return <Redirect to="/" />;
  }
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_USER, { variables: { id } });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const user = data.getUser;
  const { username, email, lists } = user;

  return (
    <div className="user-page">
      <Link to="/logout">Logout</Link>

      <h1>User</h1>

      <h3>{username}</h3>

      <table>
        <tbody>
          <tr>
            <td>Email</td>
            <td>{email}</td>
          </tr>
          <tr>
            <td>Number of lists</td>
            <td>{lists.length}</td>
          </tr>
        </tbody>
      </table>

      <br />
      <br />

      { loading && <p>Loading...</p> }
      { error && <p>Error :( Please try again</p> }

    </div>
  );
};
export default UserPage;
