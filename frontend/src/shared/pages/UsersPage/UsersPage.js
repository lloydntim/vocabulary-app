import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';

import './UsersPage.scss';

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
      email
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id) {
      username
    }
  }
`;

const UsersPage = () => {
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');

  if (!token) {
    return <Redirect to="/" />;
  }

  const { loading, error, data } = useQuery(GET_USERS);
  const [
    removeUser,
    {
      loading: mutationLoading,
      error: mutationError,
      data: mutationData,
    },
  ] = useMutation(REMOVE_USER);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="users-page">
      <Link to="/logout">Logout</Link>

      <h1>Users List</h1>

      <ul>
        {data.getUsers.map((user) => {
          const { id, username, email } = user;

          return (
            <li key={id}>
              <Link to={`/user/${id}`}>
                <span>{username}</span>
                <span> - </span>
                <span>{email}</span>
                <span> - </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  removeUser({
                    variables: { id },
                    refetchQueries: ['GetUsers'],
                  });
                }}
              >
                delete
              </button>
            </li>
          );
        })}
      </ul>

      { mutationLoading && <p>Loading...</p> }
      { mutationError && <p>Error :( Please try again</p> }
      { mutationData && <p>{`user ${mutationData.removeUser.username} has been removed.`}</p> }
    </div>
  );
};
export default UsersPage;
