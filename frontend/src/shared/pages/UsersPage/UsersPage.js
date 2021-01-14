import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';

import { RootLayout, Dialog } from '../../layouts';
import { Message } from '../../components';

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

  if (!token) return <Redirect to="/" />;

  const [users, setUsers] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [isDialogVisible, setDialogVisibility] = useState(false);
  const { data, loading, error } = useQuery(
    GET_USERS, {
      refetchQueries: ['GetUsers'],
      onCompleted: (data) => setUsers(data.getUsers),
      onError: (error) => setResponseMessage(error.message),
    },
  );
  const [
    removeUser, {
      data: mutationData,
      loading: mutationLoading,
      error: mutationError,
    },
  ] = useMutation(
    REMOVE_USER, {
      onCompleted: (data) => setCurrentUser(data.removeUser),
      onError: (error) => setResponseMessage(error.message),
    },
  );

  return (
    <RootLayout>
      <Dialog
        title="Delete User"
        cancelButtonText="Cancel"
        continueButtonText="Ok"
        isVisible={isDialogVisible}
        onCancelButtonClick={() => {
          setDialogVisibility(false);
          setCurrentUser({});
        }}
        onContinueButtonClick={() => {
          removeUser({ variables: { id: currentUser.id } });
          setDialogVisibility(false);
          setCurrentUser({});
        }}
      >
        {`You'll lose all data of user "${currentUser.username}"`}
      </Dialog>
      <div className="users-page page">
        <div className="content">
          <h1>Users List</h1>
          {data
            ? (
              <>
                <ul>
                  {users.map((user) => (
                    <li key={user.id}>
                      <Link to={`/user/${user.id}`}>
                        <span>{user.username}</span>
                        <span> - </span>
                        <span>{user.email}</span>
                        <span> - </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentUser(user);
                          setDialogVisibility(true);
                        }}
                      >
                        delete
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )
            : <p>There are no users.</p>}
          {mutationData && <Message type="success" content={`User ${currentUser.username} has been removed.`} />}
          {(loading || mutationLoading) && <Message type="info" content="...Loading" />}
          {(mutationError) && <Message type="error" content={responseMessage} />}
          {error && (
            <div className="message message-error">
              <span className="message-text">{responseMessage}</span>
              &nbsp;
              <Link className="message-link" to="/login">{t('common_button_login')}</Link>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
};
export default UsersPage;
