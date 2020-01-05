import { gql } from 'apollo-server-express';
import {
  getList,
  getLists,
  addList,
  updateList,
  removeList
} from '../list/ListController';

export const typeDefs = gql`
  input ListInput {
    name: String
    file: Upload
  }
  
  type List {
    id: ID
    name: String
  }
  
  type Query {
    getList(id: ID, name: String) : List
    getLists: [List]
  }
  
  type Mutation {
    addList(input: ListInput): List
    updateList(id: ID, input: ListInput): List
    removeList(id: ID): List
  }
`;

export const resolvers = {
  Query: {
    getList,
    getLists
  },
  Mutation: {
    addList,
    updateList,
    removeList
  }
};
