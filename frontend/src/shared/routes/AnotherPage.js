import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import './AnotherPage.scss';

export const ADD_LIST = gql`
  mutation AddList($input: ListInput!) {
    addList(input: $input) {
      name
    }
  }
`;

export const GET_LIST = gql`
  query GetList($id: ID, $name: String) {
    getList(id: $id,  name: $name) {
      name
      data
    }
  }
`;

export const GET_LISTS = gql`
  query {
    getLists {
      name
      id
    }
  }
`;

const AnotherPage = () => {
  const { loading, error, data } = useQuery(GET_LISTS);
  const fileInput = React.createRef();
  const titleInput = React.createRef();
  const [addList] = useMutation(ADD_LIST);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="test">
      <h1>Upload List</h1>

      <ul>
        {data.getLists.map((list) => (
          <li key={list.id}>
            {list.name}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const file = fileInput.current.files[0];
          const name = titleInput.current.value;
          addList({ variables: { input: { file, name } } });
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
export default AnotherPage;
