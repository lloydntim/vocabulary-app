import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import './MainPage.scss';

export const ADD_LIST = gql`
  mutation AddList($name: String!, $file: Upload!, $creatorId: ID!) {
    addList(name: $name, file: $file, creatorId: $creatorId) {
      name
    }
  }
`;

export const GET_LISTS = gql`
  query GetLists($creatorId: ID) {
    getLists(creatorId: $creatorId) {
      name
      id
    }
  }
`;

const MainPage = () => {
  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token');

  if (!token) {
    return <Redirect to="/" />;
  }

  const creatorId = jwtDecode(token).id;
  const fileInput = React.createRef();
  const titleInput = React.createRef();
  const { loading, error, data } = useQuery(GET_LISTS, { variables: { creatorId } });
  const [addList] = useMutation(ADD_LIST,
    { refetchQueries: [{ query: GET_LISTS, variables: { creatorId } }] });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="home-page">
      <Link to="/logout">Logout</Link>

      <h1>Upload List</h1>

      <ul>
        {data.getLists.map((list) => (
          <li key={list.id}>
            <Link to={`/vocablist/${list.id}`}>
              <span>{list.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const file = fileInput.current.files[0];
          const name = titleInput.current.value;
          addList({ variables: { name, file, creatorId } });
          fileInput.current.value = '';
          titleInput.current.value = '';
        }}
      >
        <label htmlFor="title">
          <span>Title</span>
          <input name="title" type="text" ref={titleInput} />
        </label>
        <input
          name="document"
          type="file"
          ref={fileInput}
        />
        <button type="submit">Add List</button>
      </form>
    </div>
  );
};
export default MainPage;
