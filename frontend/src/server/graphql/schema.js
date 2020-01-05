// import _ from 'lodash';
// import ListType from '../list/ListType';
/* eslint-disable max-len */
import { gql } from 'apollo-server-express';
import List from '../list/ListModel';

export const typeDefs = gql`
  input ListInput {
    name: String
    data: Upload
  }
  
  type List {
    id: ID
    name: String
    data: [String]
  }
  
  type Query {
    list: [List]
    lists(id: ID, name: String) : List
  }
  
  type Mutation {
    uploadFile(file: Upload!): Boolean
    addList(input: ListInput): List
    updateList(id: ID, input: ListInput): List
    removeList(id: ID): List
  }
`;

export const resolvers = {
  Query: {
    list: (parent, args) => {
      const { id, name } = args;
      return id ? List.findById(id) : List.findOne({ name });
    },
    lists: () => List.find({}),
  },
  Mutation: {
    uploadFile: (parent, args) => {
      
    },
    addList: (parent, args) => {
      /* eslint-disable no-unused-vars, no-console */
      console.log('sdfsds', args.input);
      // return List.create(args.input);
    },
    updateList: (parent, args) => {
      const { id, input } = args;

      return List.findByIdAndUpdate(id, { $set: input }, { new: true });
    },
    removeList: (parent, args) => List.findOneAndRemove({ _id: args.id }),
  },
};

export default {
  resolvers,
  typeDefs,
};
